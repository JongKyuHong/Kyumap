import Counter from "./Counter";

const getNextSequenceValue = async (sequenceName: string): Promise<number> => {
  const sequenceDocument = await Counter.findByIdAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  if (!sequenceDocument) {
    throw new Error("Sequence document not found");
  }
  return sequenceDocument.seq;
};

export default getNextSequenceValue;
