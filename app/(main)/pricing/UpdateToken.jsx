import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const UpdateToken = mutation({
  args: {
    token: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    try {
      // Retrieve the user
      const user = await ctx.db.get("users", args.userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Update the token
      const updatedUser = await ctx.db.patch(args.userId, {
        token: args.token, // Set new token value
      });

      console.log("Token updated:", updatedUser);
      return updatedUser; // Return updated user data

    } catch (error) {
      console.error("Error updating token:", error);
      throw new Error("Unable to update token");
    }
  },
});
