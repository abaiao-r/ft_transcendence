FROM python:3.8

ENV PYTHONUNBUFFERED 1

RUN mkdir /code

RUN mkdir /static

WORKDIR /code

COPY requirements.txt /code/


COPY static /static/

RUN pip install -r requirements.txt

COPY . /code/
