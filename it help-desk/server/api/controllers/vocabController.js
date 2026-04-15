//create object by schema
// check schema and save

const mongoose = require("mongoose");
const Vocab = mongoose.model("Vocab");

function normaliseWordPayload(payload) {
  const assignmentType = payload.assignmentType === "staff" ? "agent" : (payload.assignmentType || "agent");
  return {
    ...payload,
    assignmentType
  };
}


exports.list_all_words = async (req, res) => {
  try {
    const words = await Vocab.find({}).sort({ updatedAt: -1, key: 1 });
    res.json(words);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.create_a_word = async (req, res) => {
  try {
    const newWord = new Vocab(normaliseWordPayload(req.body));
    const word = await newWord.save();
    res.json(word);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.read_a_word = async (req, res) => {
  try {
    const word = await Vocab.findById(req.params.wordId);
    res.json(word);
  } catch (err) {
    res.status(500).send(err);
  }
};


exports.update_a_word = async (req, res) => {
  try {
    const word = await Vocab.findByIdAndUpdate(
      req.params.wordId,
      normaliseWordPayload(req.body),
      { new: true, runValidators: true }
    );
    res.json(word);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.delete_a_word = async (req, res) => {
  try {
    await Vocab.findByIdAndDelete(req.params.wordId);
    res.json({ message: "Word successfully deleted" });
  } catch (err) {
    res.status(500).send(err);
  }
};
