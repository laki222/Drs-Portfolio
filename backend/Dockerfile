FROM python:3.9-alpine

WORKDIR /app

ENV FLASK_APP=app.py

COPY ./requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN pip install flask_sqlalchemy

RUN pip install mysql-connector-python

RUN pip install flask-cors

RUN pip install flask-jwt-extended

RUN pip install dill

RUN pip install requests

COPY . .

EXPOSE 5000

CMD [ "python","app.py" ]