exports.studyAssistant = (req, res) => {
  res.status(200).json({
    reply: "Based on your performance, focus on Database Systems and practice past papers.",
  });
};
