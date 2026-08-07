from nycproject.app import app, db

# from .app import db

# db.drop_all()
with app.app_context():
    db.create_all()
