const mongoose = require("mongoose");

const connectionString =
  "mongodb+srv://pulkitnov2:W49N8jixTHiB5y6x@assignmentcluster.eh3iozf.mongodb.net/?retryWrites=true&w=majority&appName=AssignmentCluster";

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const entrySchema = new mongoose.Schema({
  data: String,
  type: { type: String, enum: ["add", "update"] },
});

const Entry = mongoose.model("Entry", entrySchema);

const getEntries = async (req, res) => {
  try {
    const entries = await Entry.find();
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching entries");
  }
};

const addEntry = async (req, res) => {
  const { data } = req.body;
  try {
    const newEntry = new Entry({ data, type: "add" });
    await newEntry.save();
    res.json(newEntry);
    // No need to call incrementCount here as totalCount is fetched from the server-side
  } catch (error) {
    console.error(error);
    res.status(400).send("Error adding entry");
  }
};

const incrementCount = async (type) => {
  try {
    const count = await Entry.countDocuments({ type });
    await Entry.updateOne({ type }, { count: count + 1 });
  } catch (error) {
    console.error(error);
  }
};

const updateLatestEntry = async (req, res) => {
  try {
    const latestEntry = await Entry.findOne().sort({ _id: -1 });
    if (!latestEntry) {
      return res.status(404).send("Latest entry not found");
    }
    const { data } = req.body;
    latestEntry.data = data;
    await latestEntry.save();
    await incrementCount("update"); // Increment count for update operation
    res.json(latestEntry);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating latest entry");
  }
};

const getCount = async (req, res) => {
  try {
    const addCount = await Entry.countDocuments({ type: "add" });
    const updateCount = await Entry.countDocuments({ type: "update" });
    res.json({ addCount, updateCount, totalCount: addCount + updateCount });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving entry count");
  }
};

module.exports = { Entry, getEntries, addEntry, updateLatestEntry, getCount };
