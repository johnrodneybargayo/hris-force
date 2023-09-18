const NoteModel = require("../models/note");
const UserModel = require("../models/User"); // Import the User model

const notesController = {
  createNoteForApplicant: async (applicantId, content, status, userId) => {
    console.log("Creating note with userId:", userId);
    console.log("applicantId:", applicantId);
    console.log("content:", content);
    console.log("status:", status);
  
    try {
      const newNote = new NoteModel({ content, status, applicantId, userId });
      await newNote.save();
      return newNote;
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  },
  

  getAllNotes: async () => {
    try {
      const notes = await NoteModel.find().populate("userId", "firstName lastName");
      return notes;
    } catch (error) {
      console.error("Error retrieving notes:", error);
      throw error;
    }
  },
  
  updateNoteById: async (noteId, content, status) => {
    try {
      // Find and update the note by ID
      const updatedNote = await NoteModel.findByIdAndUpdate(
        noteId,
        { content, status },
        { new: true }
      );

      if (!updatedNote) {
        return null; // Note not found
      }

      return updatedNote;
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  },

  deleteNoteById: async (noteId) => {
    try {
      // Find and remove the note by ID
      const deletedNote = await NoteModel.findByIdAndRemove(noteId);

      if (!deletedNote) {
        return null; // Note not found
      }

      return deletedNote;
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  },

  getNoteById: async (noteId) => {
    try {
      // Find the note by its ID
      const note = await NoteModel.findById(noteId);

      if (!note) {
        return null; // Note not found
      }

      return note;
    } catch (error) {
      console.error("Error retrieving note by ID:", error);
      throw error;
    }
  },

  associateNoteWithUser: async (userId, noteId) => {
    try {
      // Get the User by their ID
      const user = await UserModel.findById(userId);

      if (!user) {
        return { error: "User not found" };
      }

      // Associate the Note with the User
      user.notes.push(noteId);

      // Save the User to update the association
      await user.save();

      return { message: "Note associated with User successfully" };
    } catch (error) {
      console.error("Error associating note with User:", error);
      throw error;
    }
  },
};

module.exports = notesController;
