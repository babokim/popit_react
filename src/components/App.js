import React from 'react';
import { Layout } from 'antd';
import PopitHeader from "./PopitHeader";
import RecentPosts from "./RecentPosts";
import './popit.css';
import ChannelPostsList from "./ChannelPostsList";
import AuthorPostsList from "./AuthorPostsList";
import AdSense from 'react-adsense';

const { Content, Footer } = Layout;

export default class App extends React.Component {
  componentDidMount() {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  render(){
    return (
      <Layout className="layout" hasSider={false} style={{background: '#2b2b2b'}}>
        <PopitHeader/>
        <Content style={{ padding: '0 10px'}}>
          <div style={{float: 'left', maxWidth: 1130}}>
            <div style={{padding: 10}}>
              <RecentPosts/>
            </div>
            <div style={{background: "#2b2b2b"}}>
              <ins className="adsbygoogle"
                   style={{display: 'inline-block', width:728, height:90}}
                   data-ad-client="ca-pub-9913849834747247"
                   data-ad-slot="8038920473"></ins>
            </div>
            <div>
              <div style={{padding: 10}}>
                <div style={{float: "left", marginBottom: 10, marginRight: 15}}>
                  <AuthorPostsList/>
                </div>
                <div style={{float: "left", marginBottom: 10}}>
                  <ChannelPostsList/>
                </div>
                <div style={{clear: "both"}}/>
              </div>
            </div>
          </div>
          <div style={{float: 'left', marginLeft: 15, maxWidth: 250}}>
            <div style={{float: 'left', background: "#2b2b2b", width: 250, marginBottom: 20}}>
              <ins className="adsbygoogle"
                   style={{display: "block"}}
                   data-ad-format="fluid"
                   data-ad-layout-key="-8d+1f-e9+fe+k6"
                   data-ad-client="ca-pub-9913849834747247"
                   data-ad-slot="5956995695"></ins>
            </div>
            <div className="fb-page"
                 data-href="https://www.facebook.com/popitkr"
                 data-width="250"
                 small_header="true"
                 data-hide-cover="false"
                 adapt_container_width="false"
                 data-show-facepile="true">
            </div>
            <div style={{float: 'left', background: "#2b2b2b", width: 250, marginTop: 120}}>
              <ins className="adsbygoogle"
                   style={{display: 'block'}}
                   data-ad-format="fluid"
                   data-ad-layout-key="-8d+1f-e9+fe+k6"
                   data-ad-client="ca-pub-9913849834747247"
                   data-ad-slot="5897285940"></ins>
            </div>
          </div>
          <div style={{clear: 'both'}}></div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Copyright popit.kr
        </Footer>
      </Layout>
    );
  }
}