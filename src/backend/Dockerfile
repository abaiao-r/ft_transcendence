FROM python:3.8

ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip

RUN mkdir /code


RUN mkdir /static

WORKDIR /code

COPY requirements.txt /code/

# COPY static /static/

RUN pip install -r requirements.txt

COPY . /code/
COPY wait.sh /

RUN chmod +x /wait.sh

ENTRYPOINT ["/wait.sh"]
