###  Node.js Codebase Demonstrating Observable Pattern with RxJS
We expose two apis on /data which subscribe to observable and send data to REST api once received all data
another api is /observable/data , this will send data as stream , means as soon as data is received it will write data to http response object.

#### how to run
````
1. clone the repo
2. cd simple-node-with-rxjs
3. npm install
4. npm run start
now application will run on
http://localhost:8080/
````
### test APIs

````
This will use observable pattern but send the response on all data is collected.

curl --location --request GET 'http://localhost:8080/data' \

& This will send data as soon as it receive the data.

curl --location --request GET 'http://localhost:8080/observable/data' \

````