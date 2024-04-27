@IF NOT EXIST node_modules (
    @ECHO Installing node modules
    @npm install
    @ECHO Node modules installed
    start npm run start
) ELSE (
    @ECHO Node modules already installed
    @ECHO Starting application
    start npm run start
)