const NoteModel = require("../models/note");
const UserModel = require("../models/User"); // Import the User model

const notesController = {
  createNote: async (content, status, applicantId) => {
    try {
      // Create a new note instance
      const newNote = new NoteModel({ content, status, applicantId });

      // Save the new note to the database
      await newNote.save();

      return newNote;
    } catch (error) {
      console.error("Error creating note:", error);
      throw error;
    }
  },

  getAllNotesForUser: async (userId) => {
    try {
      // Find all notes for the specified user
      const notes = await NoteModel.find({ applicantId: userId });
  
      return notes;
    } catch (error) {
      console.error("Error retrieving notes:", error);
      throw error;
    }
  },
  
  
  updateNoteById: async (req, res) => {
    try {
      const noteId = req.params.noteId;
      const { content, status } = req.body;

      // Find and update the note by ID
      const updatedNote = await NoteModel.findByIdAndUpdate(
        noteId,
        { content, status },
        { new: true }
      );

      if (!updatedNote) {
        return res.status(404).json({ error: "Note not found" });
      }

      return res
        .status(200)
        .json({ message: "Note updated successfully", note: updatedNote });
    } catch (error) {
      console.error("Error updating note:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating the note" });
    }
  },

  deleteNoteById: async (req, res) => {
    try {
      const noteId = req.params.noteId;

      // Find and remove the note by ID
      const deletedNote = await NoteModel.findByIdAndRemove(noteId);

      if (!deletedNote) {
        return res.status(404).json({ error: "Note not found" });
      }

      return res
        .status(200)
        .json({ message: "Note deleted successfully", note: deletedNote });
    } catch (error) {
      console.error("Error deleting note:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the note" });
    }
  },

  getNoteById: async (req, res) => {
    try {
      const noteId = req.params.noteId;

      // Find the note by its ID
      const note = await NoteModel.findById(noteId);

      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }

      return res.status(200).json(note);
    } catch (error) {
      console.error("Error retrieving note by ID:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while retrieving the note" });
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
