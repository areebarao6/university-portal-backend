const Enrollment = require("../models/Enrollment");
const Fee = require("../models/Fee");
const Result = require("../models/Result");

// ================= SEED DATA =================
exports.seedData = async (req, res) => {
  try {
    // 🔴 Delete old data
    await Result.deleteMany();
    await Fee.deleteMany();
    await Enrollment.deleteMany();

    // ✅ ONLY ENROLLMENTS (ADMIN DATA)
    const enrollmentsData = [
      {
        enrollmentId: "KU-2022-CS-001",
        department: "Computer Science",
        semester: 4,
        courses: [
          { code: "CS401", name: "Course A", fee: 15000 },
          { code: "CS402", name: "Course B", fee: 15000 },
        ],
        user: null, // 🔑 important
      },
      {
        enrollmentId: "KU-2022-CS-002",
        department: "Computer Science",
        semester: 4,
        courses: [
          { code: "CS403", name: "Course A", fee: 15000 },
          { code: "CS404", name: "Course B", fee: 15000 },
        ],
        user: null,
      },
      {
        enrollmentId: "KU-2022-CS-003",
        department: "Computer Science",
        semester: 4,
        courses: [
          { code: "CS405", name: "Course A", fee: 15000 },
          { code: "CS406", name: "Course B", fee: 15000 },
        ],
        user: null,
      },
      {
        enrollmentId: "KU-2022-CS-004",
        department: "Computer Science",
        semester: 4,
        courses: [
          { code: "CS407", name: "Course A", fee: 15000 },
          { code: "CS408", name: "Course B", fee: 15000 },
        ],
        user: null,
      },
    ];

    const savedEnrollments = await Enrollment.insertMany(enrollmentsData);

    // ✅ FEES + RESULTS (NO USER YET, ONLY enrollmentId)
    const fees = savedEnrollments.map((enroll) => {
      const totalFee = enroll.courses.reduce((sum, c) => sum + c.fee, 0);
      return {
        enrollmentId: enroll.enrollmentId,
        totalFee,
        paidAmount: 0,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 din baad
        status: "Pending",
      };
    });

    const results = savedEnrollments.map((enroll) => ({
      enrollmentId: enroll.enrollmentId,
      semester: 1,
      gpa: 3.4,
      subjects: [],
    }));

    await Fee.insertMany(fees);
    await Result.insertMany(results);

    res.status(201).json({
      message: "🎉 Enrollment seed data inserted successfully",
      totalEnrollments: savedEnrollments.length,
    });
  } catch (error) {
    console.error("Seed Data Error:", error);
    res.status(500).json({
      message: "❌ Failed to insert seed data",
      error: error.message,
    });
  }
};


