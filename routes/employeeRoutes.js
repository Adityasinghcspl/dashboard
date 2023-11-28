const express = require("express")
const router = express.Router()
const employeeController = require("../controller/employeeController")

router.post('/api/employee', employeeController.createEmployee)

router.post('/api/employee/login', employeeController.getEmployeeByEmail)

router.get('/api/employee', employeeController.getAllEmployee)

router.get('/api/employeeId/:id', employeeController.getEmployeeByID)

router.put('/api/employee/:id', employeeController.updateEmployee)

router.delete('/api/employee/:id', employeeController.delateEmployee)

module.exports = router