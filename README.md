gaffa-longpoll
==============

longpoll behaviour for gaffa

## Install:

    npm i gaffa-longpoll

## Add to gaffa:

    gaffa.behaviours.constructors.longpoll = require('gaffa-longpoll');

# API

## Properties (instanceof Gaffa.Property)

### url

The url to hit for the request

### source

Data to send to the server each request

### target

Data to store after each successful response

### repoll

whether to repoll after a request ends, either in error or success.

This property is passed;

status,
error if the request errored,
data if the request succeded.

Example:

    // Repoll if the request 200's
    longpoll.repoll.binding = '(== status 200)';

### dataType

what dataType you expect the server to respond with.

either 'json' or 'text'

default is 'json'

### method

the http verb to send, GET, PUT, POST etc...