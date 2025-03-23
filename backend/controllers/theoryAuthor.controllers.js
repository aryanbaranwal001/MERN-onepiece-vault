import TheoryModel from "../models/theory.model.js";

export const create = async (req, res) => {
  try {
    const user = req.user;
    const { title, text } = req.body;

    if (!title || !text) {
      return res.status(400).send("Title and text are required");
    }

    const newTheory = await new TheoryModel({
      title,
      text,
      author: user._id,
    });

    await newTheory.save();
    
    res.status(201).send("New theory created");

  } catch (error) {
    console.log("error in create", error);
    res.status(500).send("Internal server error");
  }
}

export const update = async (req, res) => {

  const theoryId = req.params.theoryId;
  const { title, text } = req.body;

  try {
    if (!title || !text) {
      return res.status(400).json({ message: "Title and text are required" });
    }

    const updatedTheory = await TheoryModel.findByIdAndUpdate(
      theoryId,
      { title, text },
      { new: true } // Returns the updated document
    );

    if (!updatedTheory) {
      return res.status(404).json({ message: "Theory not found" });
    }

    return res.status(200).json({ message: "Theory updated successfully", theory: updatedTheory });
  } catch (error) {
    console.log("Error updating theory:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const del = async (req, res) => {
  const theoryId = req.params.theoryId;
  const userId = req.user._id;

  try {
    const theory = await TheoryModel.findById(theoryId);

    if (!theory) {
      return res.status(404).json({ message: "Theory not found" });
    }

    if (theory.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this theory" });
    }

    await TheoryModel.findByIdAndDelete(theoryId);

    return res.status(200).json({ message: "Theory deleted successfully" });
  } catch (error) {
    console.log("Error deleting theory:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
