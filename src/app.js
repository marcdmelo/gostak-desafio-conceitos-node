const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');
// const { uuid } = require("uuidv4");
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repository = {
    id:uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const findRepositiryIndex = repositories.findIndex(
      repository => repository.id == id
    );

    if(findRepositiryIndex == -1){
      return response.status(400).json( { error: 'Repository does not exists.'});
    }
    const repository = {
      id,
      title,
      url,
      techs,
      likes: repositories[findRepositiryIndex].likes,
    };

    repositories[findRepositiryIndex] = repository

    return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const findRepositiryIndex = repositories.findIndex(
    repository => repository.id == id
  );
  if(findRepositiryIndex >= 0){
    repositories.splice(findRepositiryIndex,1);
  }else{
    return response.status(400).json({error: 'Repository does not exists.'});
  }
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const findRepositiryIndex = repositories.findIndex(
    repository => repository.id == id
  );

  if(findRepositiryIndex == -1){
    return response.status(400).json( { error: 'Repository does not exists.'});
  }
  repositories[findRepositiryIndex].likes++;

  return response.json(repositories[findRepositiryIndex]);
});


module.exports = app;
