import Body from '../components/Body';
import Page from "../components/Page";

export default function ContactPage() {
    return (
        <Page content={
            <Body sidebar>
                <div>Contact</div>
            </Body>
        } title="Contact"></Page>
    );
}