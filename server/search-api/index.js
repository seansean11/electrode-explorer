"use strict";

const Path = require("path");
const Chalk = require("chalk");

const TermHandler = require("./term-handler");
const PartialHandler = require("./partial-handler");
const CreateSearchStrings = require("./create-search-strings");

const searchIndexPath = Path.join(__dirname, "../data/search-index.json");

const SearchApi = {};

SearchApi.register = (server, options, next) => {

  try {
    const searchIndex = require(searchIndexPath);
    server.settings.app.searchIndex = searchIndex;
    server.settings.app.searchStrings = CreateSearchStrings(searchIndex);
  } catch (err) {
    console.log("search Index loading error:", err);
    console.log(Chalk.red("WARNING: No search index file exists. Search will be non-functional"));
    console.log(Chalk.red(`Expected search index file path: ${searchIndexPath}`));

    server.settings.app.searchIndex = {};
  }

  server.route({
    path: "/explorer/api/search/partial/{part}",
    method: "GET",
    handler: PartialHandler
  });

  server.route({
    path: "/explorer/api/search/term/{term}",
    method: "GET",
    handler: TermHandler
  });

  return next();

};

SearchApi.register.attributes = {
  name: "portalSearchApi",
  version: "1.0.0"
};

module.exports = SearchApi;

