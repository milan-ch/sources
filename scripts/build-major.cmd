cls

call gulp clean

call gulp build --ship --no-revision

call gulp bundle --ship --no-revision

call npm version major

call gulp package-solution --ship

call explorer .\sharepoint\solution\
