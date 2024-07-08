# API DockerHub

## Description

Api que utiliza la web de DockerHub para traer información de un repositorio, si este existe da la posibilidad de descargar el ```docker-compose.yml```
ya armado gracias a la IA que utiliza para crear el compose de docker.

Luego hay un parametro si quieres ejecutar ese docker-compose.yml para que ya docker cree un contenedor.

Para usar la IA debes generar tus KEY en el ```.env```.

Este proyecto no utiliza JWT, se usa  [PASETO](https://paseto.io/).

Secret Key se genera automaticamente una vez que se logee por primera vez. Luego ya no sera necesario y utiliza el .env o de la base de datos

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
