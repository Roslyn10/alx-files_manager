import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const router = express.Router();

const routeController = (app) => {
    app.use('/', router);

    router.get('/status', (req, res) => {
        AppController.getStatus(req, res);
    });

    router.get('/stats', (req, res) => {
        AppController.getStats(req, res);
    });

    router.get('/users', (req, res) => {
        UsersController.postNew(req, res);
    });
}

// Export the routeController function
module.exports = routeController;

