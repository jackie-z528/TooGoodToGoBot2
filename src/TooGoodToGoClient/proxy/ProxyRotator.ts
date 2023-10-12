import { got } from "got-scraping";
import { load } from "cheerio";

const getProxies = async () => {
  const ip_addresses: string[] = [];
  const port_numbers: string[] = [];
  const anonymity: string[] = [];
  const google: string[] = [];
  const https: string[] = [];

  const resp = await got.get("https://sslproxies.org/");
  const $ = load(resp.body);

  $("td:nth-child(1)").each(function () {
    ip_addresses.push($(this).text());
  });

  $("td:nth-child(2)").each(function () {
    port_numbers.push($(this).text());
  });

  $("td:nth-child(5)").each(function () {
    anonymity.push($(this).text());
  });

  $("td:nth-child(6)").each(function () {
    google.push($(this).text());
  });

  $("td:nth-child(7)").each(function () {
    https.push($(this).text());
  });

  const filteredIps = ip_addresses.filter(
    (ip, idx) =>
      anonymity[idx] === "elite proxy" &&
      google[idx] === "yes" &&
      https[idx] === "yes"
  );
  const filteredPorts = port_numbers.filter(
    (port, idx) =>
      anonymity[idx] === "elite proxy" &&
      google[idx] === "yes" &&
      https[idx] === "yes"
  );
  return { ips: filteredIps, ports: filteredPorts };
};
