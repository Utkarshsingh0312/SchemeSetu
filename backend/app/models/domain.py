import datetime
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from app.database import Base

class VerificationStatus(str, enum.Enum):
    VERIFIED = "VERIFIED"
    PARTIALLY_VERIFIED = "PARTIALLY_VERIFIED"

class ApplicationStatus(str, enum.Enum):
    NOT_STARTED = "Not Started"
    DOCUMENTS_PENDING = "Documents Pending"
    READY_TO_APPLY = "Ready to Apply"
    APPLIED = "Applied"
    UNDER_REVIEW = "Under Review"
    APPROVED = "Approved"
    REJECTED = "Rejected"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    saved_schemes = relationship("SavedScheme", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=True)
    age = Column(Integer, nullable=False, default=25)
    gender = Column(String(20), nullable=False, default="Any")
    state = Column(String(50), nullable=False, default="All India")
    district = Column(String(50), nullable=True)
    annual_income = Column(Float, nullable=False, default=200000.0)
    occupation = Column(String(50), nullable=False, default="Other")
    employment_status = Column(String(50), nullable=False, default="Employed")
    category = Column(String(20), nullable=False, default="General")
    disability_status = Column(Boolean, default=False)
    marital_status = Column(String(20), default="Single")
    
    # Special conditions booleans
    student = Column(Boolean, default=False)
    farmer = Column(Boolean, default=False)
    bpl = Column(Boolean, default=False)
    senior_citizen = Column(Boolean, default=False)
    widow = Column(Boolean, default=False)
    pregnant = Column(Boolean, default=False)
    rural_resident = Column(Boolean, default=False)
    entrepreneur = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile")

class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(300), nullable=False, index=True)
    short_name = Column(String(100), nullable=True)
    short_description = Column(Text, nullable=False)
    full_description = Column(Text, nullable=False)
    state = Column(String(100), nullable=False, default="All India", index=True)
    district = Column(String(100), nullable=True)
    scheme_type = Column(String(50), nullable=False, default="Central")
    government_level = Column(String(50), nullable=False, default="Central", index=True) # Central, State, Union Territory
    ministry = Column(String(250), nullable=True, index=True)
    department = Column(String(250), nullable=True)
    category = Column(String(100), nullable=False, default="General", index=True)
    sub_category = Column(String(100), nullable=True)
    display_category = Column(String(100), nullable=True)
    
    benefit = Column(Text, nullable=False)
    benefit_amount = Column(String(150), nullable=True)
    launch_year = Column(Integer, nullable=True)
    status = Column(String(50), nullable=False, default="Active")
    target_beneficiaries = Column(Text, nullable=True)
    
    # Rules criteria
    eligibility_mode = Column(String(30), nullable=False, default="DETERMINISTIC") # DETERMINISTIC or DETAIL_REVIEW
    eligibility_description = Column(Text, nullable=True)
    min_age = Column(Integer, nullable=True, default=0)
    max_age = Column(Integer, nullable=True, default=120)
    max_income = Column(Float, nullable=True, default=10000000.0)
    occupation_rules = Column(Text, nullable=True)
    category_rules = Column(Text, nullable=True)
    gender_rules = Column(Text, nullable=True)
    disability_rules = Column(Boolean, nullable=True, default=None)
    special_conditions = Column(Text, nullable=True)

    eligible_states = Column(Text, nullable=True)
    eligible_categories = Column(Text, nullable=True)
    eligible_occupations = Column(Text, nullable=True)
    eligible_genders = Column(Text, nullable=True)
    
    documents = Column(Text, nullable=False) # JSON list
    application_steps = Column(Text, nullable=False) # JSON list
    
    deadline = Column(String(100), nullable=True)
    active = Column(Boolean, default=True)

    # MANDATORY REQUIRED VERIFICATION FIELDS:
    official_source_url = Column(String(600), nullable=False)
    official_application_url = Column(String(600), nullable=False)
    source_name = Column(String(250), nullable=False, default="Official Portal")
    last_verified_at = Column(String(50), nullable=False, default="2026-08-15")
    verification_status = Column(String(30), nullable=False, default="VERIFIED") # VERIFIED or PARTIALLY_VERIFIED

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    saved_by = relationship("SavedScheme", back_populates="scheme", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="scheme", cascade="all, delete-orphan")

class SavedScheme(Base):
    __tablename__ = "saved_schemes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="saved_schemes")
    scheme = relationship("Scheme", back_populates="saved_by")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)
    status = Column(String(30), nullable=False, default="Not Started")
    notes = Column(Text, nullable=True)
    documents_ready = Column(Text, nullable=True, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="applications")
    scheme = relationship("Scheme", back_populates="applications")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")
