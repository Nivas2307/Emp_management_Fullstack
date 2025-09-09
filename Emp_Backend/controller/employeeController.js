const db = require("../db")

//*create employee
exports.createEmployee = (req, res) => {
  const { name, email, department, designation, project, work_type, status} = req.body;
    const photo = req.file ? req.file.path : null; // multer provides file info
  db.query("insert into employees (name, email, department, designation, project, work_type, status, photo) values (?,?,?,?,?,?,?,?)",
    [name, email, department, designation, project, work_type, status, photo], (err, results) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ message: "Employee added successfully", id: results.insertId });

    }
  );
};

//*get all employee
exports.getEmployees = (req, res) => {
  db.query("select * from employees", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results)
  })
};

//*get employee by id
exports.getEmployeeById = (req, res) => {
  const { id } = req.params;
  db.query("select * from employees where id=?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: "employee not found" })
    res.json(results[0])
  });
};

//* update employee

exports.updateEmployee = (req, res) => {
  const { id } = req.params;
  const { name, email, department, designation, project, work_type, status } = req.body;

  // Use uploaded file if exists, else keep old photo
  const newPhoto = req.file ? req.file.path : null;

  // First, get existing employee
  db.query("SELECT * FROM employees WHERE id=?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ message: "Employee not found" });

    const oldPhoto = results[0].photo;
    const photoToSave = newPhoto || oldPhoto;

    // Update employee
    db.query(
      "UPDATE employees SET name=?, email=?, department=?, designation=?, project=?, work_type=?, status=?, photo=? WHERE id=?",
      [name, email, department, designation, project, work_type, status, photoToSave, id],
      (err, updateRes) => {
        if (err) return res.status(500).json(err);

        // Return the updated employee object including photo
        db.query("SELECT * FROM employees WHERE id=?", [id], (err2, updatedEmployee) => {
          if (err2) return res.status(500).json(err2);
          res.json(updatedEmployee[0]);
        });
      }
    );
  });
};

//* delete employee
exports.deleteEmployee = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM employees WHERE id=?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.json({ message: "Employee deleted" });
    }
  );
};
