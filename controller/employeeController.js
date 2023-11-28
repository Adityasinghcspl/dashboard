const asyncHandler = require("express-async-handler"); // this module to the error handling
const EmployeeModel = require("../model/mongodbModel/EmployeeModel");
const { generateToken, verifyToken } = require('../middleware/jwtToken');
const { hashPassword, comparePasswords } = require("../middleware/hashPassword");

class employeeController {
  getAllEmployee = asyncHandler(async (req, res) => {
    // Use the verifyToken middleware here
    verifyToken(req, res, async () => {
      const employee = await EmployeeModel.allEmployee();
      if (employee.length === 0) {
        res.send([]);
      } else {
        res.send({ status: 200, employee });
      }
    });
  });

  getEmployeeByID = asyncHandler(async (req, res) => {
    const employee = await EmployeeModel.findEmployeeByID(req.params.id);
    if (!employee) {
      res.status(404);
      throw new Error("Employee not found");
    }
    res.send(employee);
  });

  getEmployeeByEmail = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await EmployeeModel.findEmployeeByEmail(email);
    console.log(user, "---------");

    if (!user) {
      res.send({ status: 202, msg: "Invalid User Email & Password!" });
    } else {
      const passwordMatch = await comparePasswords(password, user.password);

      if (passwordMatch) {
        const token = generateToken(user._id); // Generate JWT token using the imported function
        res.json({
          status: 200,
          msg: "User login successfully!",
          token: token,
          userName: user.firstName,
          id: user._id,
          role: user.role,
        });
      } else {
        res.send({ status: 202, msg: "Invalid Password!" });
      }
    }
  });
  // req.params is used to get the ---- route variables
  // req.body is used to get the HTTP requeste data -----  HTTP request body

  createEmployee = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const department = "";
    var role = "user";
    if (email === "admin@gmail.com") {
      role = "admin";
    }
    if (!firstName || !lastName || !email || !password || !role) {
      res.status(400);
      throw new Error("All field are mandatory");
    }
    const hashedPassword = await hashPassword(password);
    const emp = await EmployeeModel.findEmployeeByEmail(email);
    if (!emp) {
      const employee = await EmployeeModel.createEmployee({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        department,
      });
      if (employee.length === 0) {
        res.send([]);
      } else {
        res.send({ status: 200, msg: "User created successfully." });
      }
    } else {
      res.send({ status: 202, msg: "This user all ready exist !" });
    }
  };

  updateEmployee = asyncHandler(async (req, res) => {
    verifyToken(req, res, async () => {
      const employee = await EmployeeModel.findEmployeeByID(req.params.id);
      if (!employee) {
        console.log("enter the find condition ");
        res.status(404);
        throw new Error("Employee not found");
      }
      const update = await EmployeeModel.upEmployee(req.params.id, req.body);
      if (update.length === 0) {
        res.send([]);
      } else {
        res.send(update);
      }
    })
  });

  delateEmployee = asyncHandler(async (req, res) => {
    verifyToken(req, res, async () => {
      const deleteEmplyee = await EmployeeModel.deleteEmployeetData(req.params.id);
      if (deleteEmplyee.length === 0) {
        res.send([]);
      } else {
        res.send(deleteEmplyee);
      }
    });
  })
}

module.exports = new employeeController();
