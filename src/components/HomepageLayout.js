/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */
import 'semantic-ui-css/semantic.min.css'
import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { InView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import Banks from './Banks'

import { useNavigate } from 'react-router-dom';
import {
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    List,
    Menu,
    Segment,
    Sidebar,
} from 'semantic-ui-react'


const { MediaContextProvider, Media } = createMedia({
    breakpoints: {
        mobile: 0,
        tablet: 768,
        computer: 1024,
    },
})


const HomepageHeading = ({ mobile }) => (
    <Container text>
        <Header
            as='h1'
            content='Your -Decentralized Banking System'
            inverted
            style={{
                fontSize: mobile ? '2em' : '4em',
                fontWeight: 'normal',
                marginBottom: 0,
                marginTop: mobile ? '1.5em' : '3em',
            }}
        />
        <Header
            as='h2'
            content='Trusted and Secure Banking Services.'
            inverted
            style={{
                fontSize: mobile ? '1.5em' : '1.7em',
                fontWeight: 'normal',
                marginTop: mobile ? '0.5em' : '1.5em',
            }}
        />
        <Button primary size='huge'>
            Welcome
            <Icon name='right arrow' />
        </Button>
    </Container>
)

HomepageHeading.propTypes = {
    mobile: PropTypes.bool,
}


// class MyComponent extends React.Component {
//    constructor(props) {
//      super(props);
//      this.state = { shouldRender: false };
//    }

//    componentDidMount() {
//      // set the state to true after the component has mounted
//      this.setState({ shouldRender: true });
//    }

//    render() {
//      // only render the component if shouldRender is true
//      if (!this.state.shouldRender) {
//        return null;
//      }
//      return (
//        // component's output goes here
//      );
//    }
//  }




class DesktopContainer extends Component {

    constructor() {
        super()
    }
    state = {}

    toggleFixedMenu = (inView) => this.setState({ fixed: !inView });

    render() {
        const { children } = this.props
        const { fixed } = this.state
        return (
            <Media greaterThan='mobile'>
                <InView onChange={this.toggleFixedMenu}>
                    <Segment
                        inverted
                        textAlign='center'
                        style={{ minHeight: 700, padding: '1em 0em' }}
                        vertical
                    >
                        <Menu
                            fixed={fixed ? 'top' : null}
                            inverted={!fixed}
                            pointing={!fixed}
                            secondary={!fixed}
                            size='large'
                        >
                            <Container>

                                <Menu.Item as={Link} to='/bankreserve'>Reserve Bank</Menu.Item>
                                <Menu.Item as={Link} to='/banks'>Bank</Menu.Item>
                                <Menu.Item as={Link} to='/branch'>Branch</Menu.Item>
                                <Menu.Item as={Link} to='/banking'>Banking Services</Menu.Item>
                                <Menu.Item position='right'>

                                    <Button as='a' inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }} onClick={async function requestAccount() {

                                        console.log('Requesting account...');
                                        if (window.ethereum) {
                                            console.log('detected');
                                            try {
                                                const accounts = await window.ethereum.request({
                                                    method: "eth_requestAccounts"
                                                });
                                                console.log(accounts[0]);

                                            }
                                            catch (error) {
                                                console.log('Error connecting...');
                                            }
                                        }
                                        else {
                                            console.log('Meta Mask not detected');
                                        }
                                    }}>
                                        Connect Wallet
                                    </Button>
                                </Menu.Item>

                            </Container>
                        </Menu>
                        <HomepageHeading />
                    </Segment>
                </InView>

                {children}
            </Media>
        )
    }
}

DesktopContainer.propTypes = {
    children: PropTypes.node,
}



class MobileContainer extends Component {
    state = {}

    handleSidebarHide = () => this.setState({ sidebarOpened: false })

    handleToggle = () => this.setState({ sidebarOpened: true })

    render() {
        const { children } = this.props
        const { sidebarOpened } = this.state

        return (
            <Media as={Sidebar.Pushable} at='mobile'>
                <Sidebar.Pushable>
                    <Sidebar
                        as={Menu}
                        animation='overlay'
                        inverted
                        onHide={this.handleSidebarHide}
                        vertical
                        visible={sidebarOpened}
                    >
                        <Menu.Item as='a' active>
                            Reserve Bank
                        </Menu.Item>

                        <Menu.Item as='a'>Bank</Menu.Item>
                        <Menu.Item as='a'>Branch</Menu.Item>
                        <Menu.Item as='a'>Banking Services</Menu.Item>
                        <Menu.Item as='a'>Connect</Menu.Item>
                        {/* <Menu.Item as='a'>Wallet</Menu.Item> */}
                    </Sidebar>

                    <Sidebar.Pusher dimmed={sidebarOpened}>
                        <Segment
                            inverted
                            textAlign='center'
                            style={{ minHeight: 350, padding: '1em 0em' }}
                            vertical
                        >
                            <Container>
                                <Menu inverted pointing secondary size='large'>
                                    <Menu.Item onClick={this.handleToggle}>
                                        <Icon name='sidebar' />
                                    </Menu.Item>
                                    <Menu.Item position='right'>
                                        <Button as='a' inverted>
                                            Connect
                                        </Button>
                                        <Button as='a' inverted style={{ marginLeft: '0.5em' }}>
                                            Connect
                                        </Button>
                                    </Menu.Item>
                                </Menu>
                            </Container>
                            <HomepageHeading mobile />
                        </Segment>

                        {children}
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </Media>
        )
    }
}

MobileContainer.propTypes = {
    children: PropTypes.node,
}

const ResponsiveContainer = ({ children }) => (
    /* Heads up!
     * For large applications it may not be best option to put all page into these containers at
     * they will be rendered twice for SSR.
     */
    <MediaContextProvider>
        <DesktopContainer>{children}</DesktopContainer>
        <MobileContainer>{children}</MobileContainer>
    </MediaContextProvider>
)

ResponsiveContainer.propTypes = {
    children: PropTypes.node,
}

const HomepageLayout = () => (
    <ResponsiveContainer>
        <Segment style={{ padding: '8em 0em' }} vertical>
            <Grid container stackable verticalAlign='middle'>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Header as='h3' style={{ fontSize: '2em' }}>
                            We Help customers and Investors
                        </Header>
                        <p style={{ fontSize: '1.33em' }}>
                            We can give your company superpowers to do things that they never thought possible.
                            Let us delight your customers and empower your needs... through Blockchain Technology.
                        </p>
                        <Header as='h3' style={{ fontSize: '2em' }}>
                            We Make Bananas That Can Dance
                        </Header>
                        <p style={{ fontSize: '1.33em' }}>
                            Yes that's right, you thought it was the stuff of dreams, but even bananas can be
                            bioengineered.
                        </p>
                    </Grid.Column>
                    <Grid.Column floated='right' width={6}>
                        <Image bordered rounded size='large' src='/images/wireframe/white-image.png' />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column textAlign='center'>
                        <Button size='huge'>Check Them Out</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>

        <Segment style={{ padding: '0em' }} vertical>
            <Grid celled='internally' columns='equal' stackable>
                <Grid.Row textAlign='center'>
                    <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                        <Header as='h3' style={{ fontSize: '2em' }}>
                            "What a Company"
                        </Header>
                        <p style={{ fontSize: '1.33em' }}>That is what they all say about us</p>
                    </Grid.Column>
                    <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                        <Header as='h3' style={{ fontSize: '2em' }}>
                            "I shouldn't have gone with their competitor."
                        </Header>
                        <p style={{ fontSize: '1.33em' }}>
                            <Image avatar src='/images/avatar/large/nan.jpg' />
                            <b>Nan</b> Chief Fun Officer Acme Toys
                        </p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>

        <Segment style={{ padding: '8em 0em' }} vertical>
            <Container text>
                <Header as='h3' style={{ fontSize: '2em' }}>
                    Breaking The Grid, Grabs Your Attention
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                    Instead of focusing on content creation and hard work, we have learned how to master the
                    art of doing nothing by providing massive amounts of whitespace and generic content that
                    can seem massive, monolithic and worth your attention.
                </p>
                <Button as='a' size='large'>
                    Read More
                </Button>

                <Divider
                    as='h4'
                    className='header'
                    horizontal
                    style={{ margin: '3em 0em', textTransform: 'uppercase' }}
                >
                    <a href='#'>Case Studies</a>
                </Divider>

                <Header as='h3' style={{ fontSize: '2em' }}>
                    Did We Tell You About Our Bananas?
                </Header>
                <p style={{ fontSize: '1.33em' }}>
                    Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but
                    it's really true. It took years of gene splicing and combinatory DNA research, but our
                    bananas can really dance.
                </p>
                <Button as='a' size='large'>
                    I'm Still Quite Interested
                </Button>
            </Container>
        </Segment>

        <Segment inverted vertical style={{ padding: '5em 0em' }}>
            <Container>
                <Grid divided inverted stackable>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Header inverted as='h4' content='About' />
                            <List link inverted>
                                <List.Item as='a'>Sitemap</List.Item>
                                <List.Item as='a'>Contact Us</List.Item>
                                <List.Item as='a'>Religious Ceremonies</List.Item>
                                <List.Item as='a'>Gazebo Plans</List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Header inverted as='h4' content='Services' />
                            <List link inverted>
                    <List.Item as={Link} to='/banking'>Decentralized Forex</List.Item>
                    <List.Item as='a'>Lending</List.Item>
                    <List.Item as='a'>Transfer</List.Item>
                    <List.Item as='a'> Token Swap</List.Item>
                  </List>
                        </Grid.Column>
                        <Grid.Column width={7}>
                            <Header as='h4' inverted>
                                Footer Header
                            </Header>
                            <p>
                            We Served Our Customer Since The start of the Blockchain Technology.
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </Segment>
    </ResponsiveContainer>
)

export function WithRouter(props) {
    const navigate = useNavigate();
    return (<Banks navigate={navigate}></Banks>);
};

export default HomepageLayout
