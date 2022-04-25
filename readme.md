# OSM-Dirty

A tool to mark OSM tiles as dirty after edits. Draw bounding polygons around an area with recent edits and mark the intersecting tiles as "dirty" so that they can be regenerated.

# Usage
You can use OSM-Dirty at: https://adamfranco.github.io/osmdirty/

1. Create a polygon around the area where you have made edits.
2. Select a zoom range at which to mark tiles dirty.
3. Press the "Mark Dirty" button to

Please be judicious with your use of this tool and mark the smallest areas and
zoom ranges dirty where the features you recently edited are displayed. Marking
larger areas and more zooms dirty will only cause the OSM rendering servers to
do extra work and will slow down recreation of the tiles you care about.

As an example, mountain peaks are shown at
[z11](https://www.openstreetmap.org/#map=11/44.2386/-72.8871) and higher, but
not at [z10](https://www.openstreetmap.org/#map=10/44.2386/-72.8871) and lower.
If you've added mountain peaks and want to see them rendered earlier, only mark
the zoom range 11-12 as dirty so that a minimum number of tiles are affected.

## Development Installation & Usage

Install NodeJS and the Node Package Manager (npm).

Clone this repository, then change into your new `osmdirty` directory and start a development server (available at http://localhost:1234):

    cd osmdirty
    npm start

To generate a build ready for production:

    npm run build

Then deploy the contents of the `dist` directory to your server.
