const express = require("express");

const Project = require("./data/helpers/projectModel");
const Action = require("./data/helpers/actionModel");

const router = express.Router();

router.use(express.json());

router.get("/", (req, res) => {
  Project.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the projects." });
    });
});

router.get("/:id", (req, res) => {
  Project.get(req.params.id)
    .then(project => {
      res.status(200).json(project);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the project." });
    });
});

router.get("/:id/actions", (req, res) => {
  Project.getProjectActions(req.params.id)
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error retrieving the actions." });
    });
});

router.post("/", (req, res) => {
  if (
    !req.body.name ||
    req.body.name === "" ||
    !req.body.description ||
    req.body.description === ""
  ) {
    res.status(400).json({ message: "missing project name or description." });
  } else {
    Project.insert(req.body)
      .then(newProject => {
        res.status(201).json(newProject);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Error adding the project." });
      });
  }
});

router.post("/actions", validateProjectId, (req, res) => {
  if (
    !req.body.description ||
    req.body.description === "" ||
    !req.body.notes ||
    req.body.notes === ""
  ) {
    res.status(400).json({ message: "missing action notes or description." });
  } else {
    Action.insert(req.body)
      .then(action => {
        res.status(201).json(action);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Error adding the action." });
      });
  }
});

router.delete("/:id", (req, res) => {
  Project.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The project has been nuked" });
      } else {
        res.status(404).json({ message: "The project could not be found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the project"
      });
    });
});

router.delete("/actions/:id", (req, res) => {
  Action.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The action has been nuked" });
      } else {
        res.status(404).json({ message: "The action could not be found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error action the project"
      });
    });
});

router.put("/:id", (req, res) => {
  Project.update(req.params.id, req.body)
    .then(updatedProject => {
      if (updatedProject) {
        res.status(200).json(updatedProject);
      } else {
        res.status(404).json({ message: "The project could not be found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error updating the project"
      });
    });
});

router.put("/action/:id", (req, res) => {
    Action.update(req.params.id, req.body)
      .then(updatedAction => {
        if (updatedAction) {
          res.status(200).json(updatedAction);
        } else {
          res.status(404).json({ message: "The action could not be found" });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message: "Error updating the action"
        });
      });
  });

function validateProjectId(req, res, next) {
  const project_id = parseInt(req.body.project_id);
  Project.get(project_id)
  .then(project => {
    if (project !== null) {
      req.project = project;
    } else {
      res.status(400).json({ message: "invalid project id" });
    }
  });
  next();
}

module.exports = router;
