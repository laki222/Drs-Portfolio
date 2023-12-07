from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    FirstName = db.Column(db.String(50), nullable=False)
    LastName = db.Column(db.String(50), nullable=False)
    Address = db.Column(db.String(100))
    City = db.Column(db.String(50))
    Country = db.Column(db.String(50))
    Phone = db.Column(db.String(20))
    Email = db.Column(db.String(100), unique=True, nullable=False)
    Password = db.Column(db.String(50), nullable=False)

