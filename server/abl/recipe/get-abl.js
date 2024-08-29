const path = require("path");
const Ajv = require("ajv").default;
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(
  path.join(__dirname, "..", "..", "storage", "recipes.json")
);

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
};

async function GetAbl(req, res) {
  try {
    const ajv = new Ajv();
    const body = req.query.id ? req.query : req.body;

    console.log("Request body:", body); // Přidání logování

    const valid = ajv.validate(schema, body);
    if (valid) {
      const recipeId = body.id;
      const recipe = await dao.getRecipe(recipeId);
      if (!recipe) {
        res
          .status(400)
          .send({ error: `Recipe with id '${recipeId}' doesn't exist.` });
      } else {
        res.json(recipe);
      }
    } else {
      res.status(400).send({
        errorMessage: "Validation of input failed",
        params: body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    console.error("Error in GetAbl:", e); // Přidání logování
    res.status(500).send(e);
  }
}

module.exports = GetAbl;
