const express=require("express");
const router=express.Router();
const employeeController=require("../controller/employeeController");
const upload = require("../middleware/upload");

router.post("/employees", upload.single("photo"), employeeController.createEmployee);
router.get("/employees", employeeController.getEmployees);
router.get("/employees/:id", employeeController.getEmployeeById);
router.put("/employees/:id", upload.single("photo"), employeeController.updateEmployee);
router.delete("/employees/:id", employeeController.deleteEmployee);


module.exports=router;