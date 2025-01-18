import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Check if user already exists
      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.email))
        .first(); // Use .first() instead of .collect() for a single user

      // If user does not exist, create a new one
      if (!existingUser) {
        const result = await ctx.db.insert("users", {
          name: args.name,
          picture: args.picture,
          email: args.email,
          uid: args.uid,
          token: 600000,
        });
        console.log("User created:", result);
      } else {
        console.log("User already exists:", existingUser);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  },
});

export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const user = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.email))
        .first(); // Use .first() for single user retrieval
      return user || null; // Return null if user not found
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Unable to fetch user");
    }
  },
});

export const UpdateToken = mutation({
  args: {
    token: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      const result = await ctx.db.patch(args.userId, {
        token: args.token,
      });
      console.log("Token updated:", result);
      return result;
    } catch (error) {
      console.error("Error updating token:", error);
      throw new Error("Unable to update token");
    }
  },
});
