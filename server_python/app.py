from flask import Flask
from Routers.modelRouter import modelRouter
from Routers.server import server
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

app.register_blueprint(modelRouter,url_prefix='/model')
app.register_blueprint(server,url_prefix='/api')


if __name__ == '__main__':
    print("Server Started at port : 5000")
    app.run(debug=True,port=5000)