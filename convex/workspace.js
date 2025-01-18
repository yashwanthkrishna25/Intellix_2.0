import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Mutation to Create a Workspace
export const CreateWorkspace = mutation({
  args: {
    messages: v.any(),
    user: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      const result = await ctx.db.insert("workspace", {
        messages: args.messages,
        user: args.user,
      });
      // Assuming the insert returns the full workspace object
      return result._id; // Returning the workspace ID
    } catch (error) {
      console.error("Error creating workspace:", error);
      throw new Error("Unable to create workspace");
    }
  },
});

// Query to Get a Workspace by ID
export const GetWorkspace = query({
  args: {
    workspaceId: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    try {
      const result = await ctx.db.get(args.workspaceId);
      if (!result) {
        throw new Error("Workspace not found");
      }
      return result;
    } catch (error) {
      console.error("Error fetching workspace:", error);
      throw new Error("Unable to fetch workspace");
    }
  },
});

// Mutation to Update Workspace Messages
export const UpdateMessages = mutation({
  args: {
    workspaceId: v.id("workspace"),
    messages: v.any(),
  },
  handler: async (ctx, args) => {
    try {
      const result = await ctx.db.patch(args.workspaceId, {
        messages: args.messages,
      });
      return result; // Returning the updated workspace
    } catch (error) {
      console.error("Error updating messages:", error);
      throw new Error("Unable to update messages");
    }
  },
});

// Mutation to Update Files in Workspace
export const UpdateFiles = mutation({
  args: {
    workspaceId: v.id("workspace"),
    files: v.any(),
  },
  handler: async (ctx, args) => {
    try {
      const result = await ctx.db.patch(args.workspaceId, {
        fileData: args.files,
      });
      return result; // Returning the updated workspace
    } catch (error) {
      console.error("Error updating files:", error);
      throw new Error("Unable to update files");
    }
  },
});

// Query to Get All Workspaces for a User
export const GetAllWorkspace = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      const result = await ctx.db
        .query("workspace")
        .filter((q) => q.eq(q.field("user"), args.userId))
        .collect();
      return result; // Return the list of workspaces
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      throw new Error("Unable to fetch workspaces");
    }
  },
});
