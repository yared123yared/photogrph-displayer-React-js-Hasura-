import React, { Component, Fragment } from 'react';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import './Drawer.css'
// import { withApollo } from '@apollo/react-hoc';
import { gql } from '@apollo/client';
import { withApollo, Subscription } from 'react-apollo'

const useStyles = theme => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),

    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',

    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,

    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
});

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

class Album extends Component {

    state = {
        photosByEmail: [],
        loggedInPhotographers: [],
        photographerData: {},
        photosToUpload: '',
        email: '',
        sucess: '',


    }
    // Get Logged in user email
    getLogedInEmail = async () => {


        console.log("this is logged in users");
        const { loading, error, data } = await this.props.client.query({
            query: gql`
            
            query MyQuery {
                LoggedInPhotographer {
                  Email
                }
              }
            `,

            variables: null,

        });



        if (error) {
            console.error(error);
            return (<div>
                Error : error.toString();
            </div>)
        }
        // console.log(data.Photographer);

        await this.setState({ loggedInPhotographers: data.LoggedInPhotographer });
        console.log(this.state.loggedInPhotographers);




    }
    // Get Photographer information 
    getPhotographerInformation = async (email) => {

        console.log("getPhotographerInformationn");
        const { loading, error, data } = await this.props.client.query({
            query: gql`
            
            query MyQuery {
                Photographer(where: {Email: {_eq: "${email}"}}) {
                 
                 
                    City
                    Country
                    Email
                    FName
                    Gender
                    LName
                    ProfilePictureName
                    WorkTitle

                 
                }
              }
              
            `,

            variables: null,
        });



        if (error) {
            console.error(error);
            return (<div>
                Error : error.toString();
            </div>)
        }
        // console.log(data.Photographer);

        await this.setState({ photographerData: data.Photographer[0] });
        console.log(this.state.photographerData);


    }
    // Get Photos of logged in photographer
    getPhotoByEmail = async (email) => {
        console.log("this is the submit button");
        const { loading, error, data } = await this.props.client.query({
            query: gql`
            
            query MyQuery {
                Photos(where: {PhotographerEmail: {_eq: "${email}"}}) {
                  PhotosName
                }
              }
              
            `,

            variables: null,
        });



        if (error) {
            console.error(error);
            return (<div>
                Error : error.toString();
            </div>)
        }
        // console.log(data.Photographer);

        await this.setState({ photosByEmail: data.Photos });

        console.log(this.state.photosByEmail);





        // 
    }

    componentDidMount = async () => {

        console.log("this is the hello world method");
        console.log("This is the data that came from S component", this.props.data);

        await this.getLogedInEmail();
        // await this.getPhotoByEmail()
        var emails = [...this.state.loggedInPhotographers];
        var email = emails[emails.length - 1].Email;//get last item in the array  

        console.log("logged in users", this.state.loggedInPhotographers);
        console.log("email logged in", email);

        await this.setState({ email: email });
        await this.getPhotographerInformation(email);
        await this.getPhotoByEmail(email);



        console.log("Photographers", this.state.photographerData);

        console.log("this is the hello world method");
        // this.photoSubscription();

        // await this.photoSubscription();



    }


    getCurrentlyLoggedInUser = () => {
        console.log("this is the  getCurrentlyLoggedInUserMehtod");
        const new_email = "yaredyaya16@gmail.com";
        this.setState({
            email: new_email
        })
        // return "yaredyaya16@gmail.com";
    }
    onChange = (e) => {
        let files = e.target.files;
        console.warn("data file", files);
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (e) => {
            console.warn("img data", e.target.result);
            this.setState({ photosToUpload: e.target.result })
        }
    }
    handleUpload = async () => {

        console.log("upload image");

        // 

        console.log("this is the submit button");
        const { loading, error, data } = await this.props.client.mutate({
            mutation: gql`
            
            mutation {
                insert_Photos(objects: {
                     PhotographerEmail: "${this.state.email}",
                     PhotosName: "${this.state.photosToUpload}"
                    
                    }) {
                  affected_rows
                  returning {
                    PhotosId
                  }
                }
              }
              
`,


            variables: null,
        })

        if (error) {
            console.error(error);
            return (<div>
                Error : error.toString();
            </div>)
        }

        await this.setState({
            sucess: 'Sccessfully uploaded...'
        })

        console.log("Sccessfully uploaded...");

    }
    _subscribeToNewLinks = async () => {
        // ... you'll implement this 🔜

    }
    // Subscribe photo
    photoSubscription = async () => {
        const GET_POST = gql`
        subscription MySubscription {
            Photos(where: {PhotographerEmail: {_eq: "yaredyaya16@gmail.com"}}) {
              PhotosName
            }
          }
          
          
        `;


        this.props.client
            .subscribe({
                subscription: GET_POST,

            })

            .then((response) => console.log("Response data comes from graphql : ", response.data))
            .catch((err) => console.error(err));


    }


    render() {

        const { photosByEmail } = this.state;
        // const { photographer } = this.state.photographerData;



        const { classes } = this.props;

        const { photographerData } = this.state;
        return (

            <React.Fragment>




                <CssBaseline />
                <main>
                    {/* Hero unit */}
                    <div className={classes.heroContent}>
                        <Container maxWidth="sm">
                            <div className={classes.heroButtons}>
                                <div xs={12} sm={6} md={4} className="profile">
                                    <Card className={classes.card}>
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image={photographerData.ProfilePictureName}
                                            title="Image title"
                                        />


                                        <CardContent className={classes.cardContent}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {photographerData.FName} {photographerData.LName}
                                            </Typography>
                                            <Typography>
                                                {photographerData.WorkTitle}
                                            </Typography>
                                            <Typography>
                                                {photographerData.Country}
                                            </Typography>
                                            <Typography>
                                                {photographerData.City}
                                            </Typography>

                                        </CardContent>

                                    </Card>
                                </div>
                                <p className="success">{this.state.sucess}</p>
                                <Grid className="addIMage" container spacing={2} justify="center">
                                    <div className="button_upload">
                                        <input color="danger" type="file" name="file" onChange={(e) => this.onChange(e)} />
                                    </div>

                                    <Button onClick={this.handleUpload} variant="contained" color="primary">
                                        Upload
                                    </Button>

                                </Grid>
                                <Grid item>



                                </Grid>

                            </div>

                        </Container>
                    </div>
                    <Container className={classes.cardGrid} maxWidth="md">
                        {/* End hero unit */}
                        <Grid container spacing={4}>
                            <Subscription subscription={gql`
                                    subscription{
                                        Photos(where: {PhotographerEmail: {_eq: "${this.state.email}"}}) {
                                          PhotosName
                                        }
                                      }
                                      
                            `}>
                                {({ loading, error, data }) => {
                                    if (loading) {
                                        return (
                                            <div>
                                                <h1>
                                                    Loading...
                                                </h1>
                                            </div>
                                        );
                                    }
                                    if (error) {
                                        return (
                                            <div>
                                                <h2>Error : {error.toString()}</h2>
                                            </div>
                                        );
                                    }
                                    if (data) {
                                        console.log("data", data);

                                    }

                                    return (


                                        data.Photos.map((photo) => (
                                            <Grid item key={photo} xs={12} sm={6} md={4}>
                                                <Card className={classes.card}>
                                                    <CardMedia
                                                        className={classes.cardMedia}
                                                        image={photo.PhotosName}
                                                        title="profile"
                                                    />

                                                    <CardContent className={classes.cardContent}>
                                                        <Typography gutterBottom variant="h5" component="h2">
                                                            {/* {photographer.fName + " " + photographer.lName} */}
                                                        </Typography>
                                                        <Typography>
                                                            This is a media card. You can use this section to describe the content.
                                        </Typography>
                                                    </CardContent>
                                                    <CardActions>
                                                        <Button size="small" color="primary">
                                                            View
                                        </Button>
                                                        <Button size="small" color="primary">
                                                            Edit
                                        </Button>
                                                    </CardActions>
                                                </Card>

                                            </Grid>
                                        ))


                                    );

                                }}

                            </Subscription>
                        </Grid>
                    </Container>
                </main>

            </React.Fragment >
        );
    }
}

export default withApollo(withStyles(useStyles)(Album))

