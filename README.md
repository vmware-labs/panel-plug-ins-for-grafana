# Table - Arrays Grafana Plugin

## What is Grafana Panel Plugin?

Panels are the building blocks of Grafana. They allow you to visualize data in different ways. While Grafana has several types of panels already built-in, you can also build your own panel, to add support for other visualizations.

For more information about panels, refer to the documentation on [Panels](https://grafana.com/docs/grafana/latest/features/panels/panels/)


## Description

This plugin is made to visualize the array object inside of a table.  Anyone with requirements matching the features listed below may find the plugin useful.  It is being developed with React, material-table, NodeJS, and grafana-toolkit.

Plugin Features :
* List JSON Array items where each item in an array is a row
* Arithmetic operations between fields to create a new column
* Transformations
* Sortable columns
* Pagination
* Search bar to search the table
* Display non-array objects
* Export data as a CSV

## Requirements
* Grafana >= 7.0.3
* NodeJS >= 13
* yarn
* npm

## Installation

1. Install dependencies (note: you must run both the npm and yarn install commands)

   ```bash
   yarn install
   npm install
   ```

2. Build plugin in development mode or run in watch mode

   ```bash
   yarn dev
   ```

   or

   ```bash
   yarn watch
   ```

3. Start Grafana

   ```bash
   docker run -d --name grafana --volume "<PATH-TO-YOUR-PLUGINS>:/var/lib/grafana/plugins" -p 3000:3000 grafana/grafana
   ```

Note: Grafana only checks for plugins on start-up, so if you were already running Grafana prior to installing, you must restart Grafana

```bash
   docker restart grafana
   ```

## Usage 
1. Under the visualization menu choose "Table - Arrays"

2. Add any data source and define your query 

3. Under the display dropdown on the right, there is an input field for "Query" where you can select which of your queries you would like to use for the following steps.

4. Next in the display dropdown is a menu labeled "Field to Display". This menu will list all of the fields in your table that are of type array.  Choosing one will display that array's data on the table as if it was its own DataFrame. "Default" will display the entire query in the same format as the traditional Grafana Table.

5. Lastly in the dropdown is arithmetic operations.  You can click the switch labeled "show arithmetic operation menu" to open the arithmetic menu.  Here you choose an operation method (+, -, *, /), select two columns to perform the operation on.  Next you can optionally type in an alias for the name of the new column created as a result of the operation.  Once the above fields have been filled, a switch will appear allowing activation and deactivation of the arithmetic operation.  Turning on the switch will create a new column on the table, with the result of the operation in each row.

6. Moving to the table, the top right contains a search bar, where the table will narrow down the rows to ones that match your search.

7. To the right of the search bar is an export button, which will download a CSV of the table's data.

8. Sorting the columns is possible by clicking on the name of any column.  It will alternate between ascending, descending, and no order on each click.

9. On the bottom right of the table is a pagination menu.  You can choose to show 5, 10, or 20 items per page.  Then there are buttons to iterate through the table by page, or skip to the right or left most pages.

## Roadmap

* Add support to search by specific columns
* Allow user to select a row and pop up a graph visualizing historical datapoints for that session

## Learn more

- [Build a panel plugin tutorial](https://grafana.com/tutorials/build-a-panel-plugin)
- [Grafana documentation](https://grafana.com/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/) - Grafana Tutorials are step-by-step guides that help you make the most of Grafana
- [Grafana UI Library](https://developers.grafana.com/ui) - UI components to help you build interfaces using Grafana Design System
