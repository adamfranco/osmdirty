# OSM-Dirty

 A tool to mark OSM tiles as dirty after edits. Draw bounding polygons around an area with recent edits and mark the intersecting tiles as "dirty" so that they can be regenerated.

## Installation & Usage

Install NodeJS and the Node Package Manager (npm).

Clone this repository, then change into your new `osmdirty` directory and start a development server (available at http://localhost:1234):

    cd osmdirty
    npm start

To generate a build ready for production:

    npm run build

Then deploy the contents of the `dist` directory to your server.
