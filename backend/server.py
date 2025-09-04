from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Cookie, Depends, File, UploadFile, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import httpx
import jwt
import hashlib
import tempfile
import torch
import numpy as np
from monai.transforms import Compose, LoadImage, EnsureChannelFirst, ScaleIntensity, Resize, ToTensor
from monai.networks.nets import DenseNet121
import json

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(
    title="CornealAI Medical Diagnostics API",
    description="AI-powered corneal analysis for medical diagnostics",
    version="1.0.0"
)

# Create API router
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer(auto_error=False)

# MONAI components (will be initialized)
model = None
transforms = None
device = None

# Pydantic Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    picture: Optional[str] = None
    role: str = "Collaborator"  # Admin, Collaborator, Scientist
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

class UserSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AuthResponse(BaseModel):
    success: bool
    user: Optional[User] = None
    message: str

class AnalysisRequest(BaseModel):
    patient_id: str
    analysis_type: str = "corneal_pattern_recognition"
    additional_notes: Optional[str] = None

class AnalysisResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    user_id: str
    file_name: str
    analysis_type: str
    predictions: Dict[str, float]
    confidence_scores: Dict[str, float]
    clinical_findings: List[str]
    primary_diagnosis: str
    processing_time_seconds: float
    model_version: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    validated_by: Optional[str] = None
    scientist_notes: Optional[str] = None

class FileRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    file_name: str
    file_type: str  # "corneal_image" or "medical_record"
    file_path: str
    patient_id: str
    upload_date: datetime = Field(default_factory=datetime.utcnow)
    analysis_status: str = "pending"  # pending, processing, completed, failed

# Initialize MONAI components
async def initialize_monai():
    """Initialize MONAI model and transforms for corneal analysis"""
    global model, transforms, device
    
    try:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Initializing MONAI on device: {device}")
        
        # Define medical image preprocessing transforms
        transforms = Compose([
            LoadImage(image_only=True, ensure_channel_first=True),
            EnsureChannelFirst(),
            ScaleIntensity(),
            Resize(spatial_size=(512, 512)),
            ToTensor()
        ])
        
        # Initialize medical imaging model
        model = DenseNet121(
            spatial_dims=2,
            in_channels=1,
            out_channels=5,  # 5 corneal conditions
            pretrained=False  # We'll use our own weights
        ).to(device)
        
        # For demo purposes, we'll use random weights
        # In production, load pre-trained medical weights
        model.eval()
        
        logger.info("MONAI components initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize MONAI components: {str(e)}")

# Dependency to get current user
async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[User]:
    """Get current authenticated user from session cookie or bearer token"""
    
    session_token = None
    
    # Try to get token from cookie first
    session_token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not session_token and credentials:
        session_token = credentials.credentials
    
    if not session_token:
        return None
    
    try:
        # Find session in database
        session = await db.user_sessions.find_one({
            "session_token": session_token,
            "expires_at": {"$gt": datetime.utcnow()}
        })
        
        if not session:
            return None
        
        # Get user data
        user_data = await db.users.find_one({"id": session["user_id"]})
        if not user_data:
            return None
        
        return User(**user_data)
        
    except Exception as e:
        logger.error(f"Error getting current user: {str(e)}")
        return None

# Authentication routes
@api_router.post("/auth/validate-session", response_model=AuthResponse)
async def validate_session(request: Request):
    """Validate session from Emergent auth and create local session"""
    
    session_id = request.headers.get("X-Session-ID")
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    try:
        # Call Emergent auth API to get user data
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
        
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        user_data = response.json()
        
        # Check if user already exists
        existing_user = await db.users.find_one({"email": user_data["email"]})
        
        if existing_user:
            user = User(**existing_user)
            # Update last login
            await db.users.update_one(
                {"id": user.id},
                {"$set": {"last_login": datetime.utcnow()}}
            )
        else:
            # Create new user
            user = User(
                email=user_data["email"],
                name=user_data["name"],
                picture=user_data.get("picture"),
                role="Collaborator"  # Default role
            )
            await db.users.insert_one(user.dict())
        
        # Create session
        session_token = user_data["session_token"]
        expires_at = datetime.utcnow() + timedelta(days=7)
        
        user_session = UserSession(
            user_id=user.id,
            session_token=session_token,
            expires_at=expires_at
        )
        
        # Save session to database
        await db.user_sessions.insert_one(user_session.dict())
        
        # Create response with cookie
        response = JSONResponse({
            "success": True,
            "user": user.dict(),
            "message": "Authentication successful"
        })
        
        response.set_cookie(
            key="session_token",
            value=session_token,
            expires=expires_at,
            httponly=True,
            secure=True,
            samesite="none",
            path="/"
        )
        
        return response
        
    except httpx.RequestError as e:
        logger.error(f"Auth API request error: {str(e)}")
        raise HTTPException(status_code=500, detail="Authentication service unavailable")
    except Exception as e:
        logger.error(f"Session validation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Authentication failed")

@api_router.get("/auth/me", response_model=AuthResponse)
async def get_current_user_info(current_user: Optional[User] = Depends(get_current_user)):
    """Get current user information"""
    
    if not current_user:
        return AuthResponse(success=False, message="Not authenticated")
    
    return AuthResponse(success=True, user=current_user, message="Authenticated")

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user and clear session"""
    
    session_token = request.cookies.get("session_token")
    
    if session_token:
        # Remove session from database
        await db.user_sessions.delete_one({"session_token": session_token})
    
    # Clear cookie
    response.delete_cookie("session_token", path="/")
    
    return {"success": True, "message": "Logged out successfully"}

# Medical analysis routes
async def process_corneal_image(file_path: str, patient_id: str, user_id: str) -> Dict[str, Any]:
    """Process corneal image using MONAI framework"""
    
    start_time = datetime.utcnow()
    
    try:
        if model is None or transforms is None:
            # Mock analysis for demo if MONAI not available
            predictions = {
                "0": 0.65,  # Normal
                "1": 0.20,  # Dystrophy
                "2": 0.10,  # Keratoconus
                "3": 0.03,  # Scarring
                "4": 0.02   # Astigmatism
            }
        else:
            # Load and preprocess image
            image_tensor = transforms(file_path)
            image_tensor = image_tensor.unsqueeze(0).to(device)
            
            # Perform inference
            with torch.no_grad():
                model_output = model(image_tensor)
                probabilities = torch.softmax(model_output, dim=1)
                predictions_array = probabilities.cpu().numpy()[0]
                
                predictions = {str(i): float(conf) for i, conf in enumerate(predictions_array)}
        
        # Define clinical condition mapping
        condition_mapping = {
            "0": "Normal corneal structure",
            "1": "Corneal dystrophy detected", 
            "2": "Keratoconus progression",
            "3": "Corneal scarring present",
            "4": "Irregular astigmatism pattern"
        }
        
        # Generate clinical findings
        confidence_scores = {condition_mapping[k]: v for k, v in predictions.items()}
        max_confidence_key = max(predictions.items(), key=lambda x: x[1])[0]
        primary_diagnosis = condition_mapping[max_confidence_key]
        
        clinical_findings = []
        for condition, confidence in confidence_scores.items():
            if confidence > 0.1:  # Clinical significance threshold
                clinical_findings.append(f"{condition} (confidence: {confidence:.3f})")
        
        processing_time = (datetime.utcnow() - start_time).total_seconds()
        
        return {
            "predictions": predictions,
            "confidence_scores": confidence_scores,
            "clinical_findings": clinical_findings,
            "primary_diagnosis": primary_diagnosis,
            "processing_time_seconds": processing_time,
            "model_version": "corneal_analysis_v1.0"
        }
        
    except Exception as e:
        logger.error(f"Error processing corneal image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")

@api_router.post("/upload/corneal-image", response_model=AnalysisResult)
async def upload_corneal_image(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    patient_id: str = "unknown",
    current_user: User = Depends(get_current_user)
):
    """Upload and analyze corneal image"""
    
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload an image file.")
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Process image
        analysis_data = await process_corneal_image(temp_file_path, patient_id, current_user.id)
        
        # Create analysis result
        result = AnalysisResult(
            patient_id=patient_id,
            user_id=current_user.id,
            file_name=file.filename,
            analysis_type="corneal_pattern_recognition",
            predictions=analysis_data["predictions"],
            confidence_scores=analysis_data["confidence_scores"],
            clinical_findings=analysis_data["clinical_findings"],
            primary_diagnosis=analysis_data["primary_diagnosis"],
            processing_time_seconds=analysis_data["processing_time_seconds"],
            model_version=analysis_data["model_version"]
        )
        
        # Save to database
        await db.analysis_results.insert_one(result.dict())
        
        # Save file record
        file_record = FileRecord(
            user_id=current_user.id,
            file_name=file.filename,
            file_type="corneal_image",
            file_path=temp_file_path,
            patient_id=patient_id,
            analysis_status="completed"
        )
        await db.file_records.insert_one(file_record.dict())
        
        # Schedule cleanup
        background_tasks.add_task(cleanup_temp_file, temp_file_path)
        
        return result
        
    except Exception as e:
        logger.error(f"Upload processing failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload processing failed: {str(e)}")

@api_router.get("/analysis/results", response_model=List[AnalysisResult])
async def get_analysis_results(
    current_user: User = Depends(get_current_user),
    limit: int = 20,
    skip: int = 0
):
    """Get analysis results for current user"""
    
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Admin can see all results, others see only their own
    query = {} if current_user.role == "Admin" else {"user_id": current_user.id}
    
    results = await db.analysis_results.find(query).skip(skip).limit(limit).to_list(limit)
    return [AnalysisResult(**result) for result in results]

@api_router.put("/analysis/{analysis_id}/validate")
async def validate_analysis(
    analysis_id: str,
    scientist_notes: str,
    current_user: User = Depends(get_current_user)
):
    """Validate analysis results (Scientists and Admins only)"""
    
    if not current_user or current_user.role not in ["Scientist", "Admin"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    result = await db.analysis_results.update_one(
        {"id": analysis_id},
        {
            "$set": {
                "validated_by": current_user.id,
                "scientist_notes": scientist_notes,
                "validation_date": datetime.utcnow()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return {"success": True, "message": "Analysis validated successfully"}

@api_router.get("/users", response_model=List[User])
async def get_users(current_user: User = Depends(get_current_user)):
    """Get all users (Admin only)"""
    
    if not current_user or current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = await db.users.find().to_list(1000)
    return [User(**user) for user in users]

@api_router.put("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    role: str,
    current_user: User = Depends(get_current_user)
):
    """Update user role (Admin only)"""
    
    if not current_user or current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    if role not in ["Admin", "Collaborator", "Scientist"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {"role": role}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"success": True, "message": "User role updated successfully"}

# Background tasks
async def cleanup_temp_file(file_path: str):
    """Clean up temporary files"""
    try:
        Path(file_path).unlink(missing_ok=True)
        logger.debug(f"Cleaned up temporary file: {file_path}")
    except Exception as e:
        logger.warning(f"Failed to cleanup file {file_path}: {str(e)}")

# Health check
@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "model_loaded": model is not None,
        "gpu_available": torch.cuda.is_available() if torch is not None else False
    }

# Include router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize app on startup"""
    try:
        await initialize_monai()
        logger.info("CornealAI API started successfully")
    except Exception as e:
        logger.error(f"Startup failed: {str(e)}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()