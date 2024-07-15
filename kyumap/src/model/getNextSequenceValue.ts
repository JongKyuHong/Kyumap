import Counter from "./Counter";

const getNextSequenceValue = async (sequenceName: string): Promise<number> => {
  console.log(`Getting next sequence value for: ${sequenceName}`);
  const sequenceDocument = await Counter.findByIdAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (!sequenceDocument) {
    throw new Error("Sequence document not found");
  }

  console.log(
    `New sequence value for ${sequenceName}: ${sequenceDocument.seq}`
  );
  return sequenceDocument.seq;
};

export default getNextSequenceValue;
