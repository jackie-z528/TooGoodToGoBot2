import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"
import { TooGoodToGoClient } from "../../TooGoodToGoClient/TooGoodToGoClient";
import { Command } from "./models/Command";
export const loginCommand: Command = {
    data: new SlashCommandBuilder().setName("login").setDescription("Login with your TooGoodToGo email").addStringOption(option => option.setName("email").setDescription("Email to login with").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const email = interaction.options.getString("email") 
        if (!email) return;
        const client = new TooGoodToGoClient(); 
        try {
            await client.login(email, interaction.channelId);
            await interaction.reply(`Login request sent to ${email}, /continue-login after clicking the login button in your email in a browser. DO NOT CLICK THE LINK ON YOUR PHONE.`);
        } catch (err) {
            await interaction.reply(`Error sending login request, try again later`);
        }
    }
}

export const continueLoginCommand: Command = {
    data: new SlashCommandBuilder().setName("continue-login").setDescription("Continue login after clicking the link sent to your email").addStringOption(option => option.setName("email").setDescription("Email to login with").setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const email = interaction.options.getString("email");
        if (!email) return;
        const client = new TooGoodToGoClient();
        try {
            await client.continueLogin(email);
            await interaction.reply(`Successfully completed login with ${email}`);
        } catch (err) {
            await interaction.reply(`Error completing login with ${email}`);
        }
    }
}