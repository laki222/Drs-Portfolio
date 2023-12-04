FROM python:3.9-alpine

WORKDIR /app

ENV FLASK_APP=app.py

COPY ./requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN pip3 install flask_pymongo

COPY . .

EXPOSE 5000

CMD [ "python","app.py" ]