import { BucketItem } from "../TooGoodToGoClient/models/Bucket";
import { EmbedBuilder } from "discord.js";

export const buildRestockEmbed = (bucketItem: BucketItem): EmbedBuilder => {
    const { item, display_name, items_available } = bucketItem;
    const { price_including_taxes, cover_picture, logo_picture } = item;
    const price = (price_including_taxes.minor_units / 100).toFixed(2);
    return new EmbedBuilder()
        .setAuthor({ name: "TooGoodToGoBot", iconURL: "https://tgtg-mkt-cms-prod.s3.eu-west-1.amazonaws.com/13512/TGTG_Icon_White_Cirle_1988x1988px_RGB.png" })
        .setTitle(`${display_name} Restocked!`)
        .setDescription(`New items available from ${display_name}`)
        .setThumbnail(logo_picture.current_url)
        .addFields(
            { name: "New Stock", value: items_available.toString(), inline: true },
            { name: "Price", value: price, inline: true }
        )
        .setImage(cover_picture.current_url);
};
