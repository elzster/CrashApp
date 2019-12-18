from .app import db


<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 9bc2711de6615c6d3ac6c4e517ed0aea521f1705
class crashdata(db.Model):
    __tablename__ = 'nyctable'

    id = db.Column(db.Integer, primary_key=True)
<<<<<<< HEAD
=======
=======
class crashData(db.Model):
    __tablename__ = 'nyctable'

    # id = db.Column(db.Integer, primary_key=True)
>>>>>>> 79174aaca6b7c748be4ab999b0f706c22b3e57ce
>>>>>>> 9bc2711de6615c6d3ac6c4e517ed0aea521f1705
    crash_date = db.Column(db.Date)
    crash_time = db.Column(db.Float)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
<<<<<<< HEAD
    on_street_name = db.Column(db.Text)
    off_street_name = db.Column(db.Text)
=======
<<<<<<< HEAD
    on_street_name = db.Column(db.Text)
    off_street_name = db.Column(db.Text)
=======
    on_street_name = db.Column(db.text)
    off_street_name = db.Column(db.text)
>>>>>>> 79174aaca6b7c748be4ab999b0f706c22b3e57ce
>>>>>>> 9bc2711de6615c6d3ac6c4e517ed0aea521f1705
    number_of_persons_injured = db.Column(db.Integer)
    number_of_persons_killed = db.Column(db.Integer)
    number_of_pedestrians_injured = db.Column(db.Integer)
    number_of_pedestrians_killed = db.Column(db.Integer)
    number_of_cyclist_injured = db.Column(db.Integer)
    number_of_cyclist_killed = db.Column(db.Integer)
    number_of_motorist_injured = db.Column(db.Integer)
    number_of_motorist_killed = db.Column(db.Integer)
    contributing_factor_vehicle_1 = db.Column(db.Text)
    collision_id = db.Column(db.Integer)
    vehicle_type_code1 = db.Column(db.Text)
    vehicle_type_code2 = db.Column(db.Text)
    cross_street_name = db.Column(db.Text)
    contributing_factor_vehicle_3 = db.Column(db.Text)
    contributing_factor_vehicle_4 = db.Column(db.Text)
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 9bc2711de6615c6d3ac6c4e517ed0aea521f1705
    vehicle_type_code_3 = db.Column(db.Text)
    vehicle_type_code_4 = db.Column(db.Text)
    contributing_factor_vehicle_5 = db.Column(db.Text)
    vehicle_type_code_5 = db.Column(db.Text)

    def __repr__(self):
<<<<<<< HEAD
        return '<Crash %r>' % (self.name)
=======
        return '<Crash %r>' % (self.name)
=======
    vehicle_type_code_3 = db.Column(db.text)
    vehicle_type_code_4 = db.Column(db.text)
    contributing_factor_vehicle_5 = db.Column(db.text)
    vehicle_type_code_5 = db.Column(db.text)

    def __repr__(self):
        return '<Pet %r>' % (self.name)
>>>>>>> 79174aaca6b7c748be4ab999b0f706c22b3e57ce
>>>>>>> 9bc2711de6615c6d3ac6c4e517ed0aea521f1705
