/**
 * Email Templates using React Email
 * Beautiful, responsive email templates for all notification types
 */

import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Button,
  Img,
  Hr,
  Link,
} from '@react-email/components';

// Base styles for all emails
const main = {
  backgroundColor: '#f0f4ff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const box = {
  padding: '0 48px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const heading = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#1a325d',
  margin: '16px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#3a5483',
  margin: '16px 0',
};

const button = {
  backgroundColor: '#5a76a9',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '12px 24px',
  margin: '16px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '16px 0',
  textAlign: 'center',
};

/**
 * New Lead Notification Email
 */
export const NewLeadEmail = ({ 
  brandOwnerName, 
  brandName, 
  prospectName, 
  prospectEmail, 
  prospectPhone,
  budget,
  location,
  message,
  leadUrl 
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src="https://franchise-portal.com/logo.png"
            width="150"
            height="50"
            alt="ikama - Franchise Hub"
            style={{ margin: '0 auto 24px', display: 'block' }}
          />
          
          <Heading style={heading}>New Franchise Inquiry! 🎉</Heading>
          
          <Text style={paragraph}>
            Hi {brandOwnerName},
          </Text>
          
          <Text style={paragraph}>
            Great news! You have a new inquiry for your <strong>{brandName}</strong> franchise.
          </Text>

          <Section style={{ 
            backgroundColor: '#f8fafc', 
            borderRadius: '8px', 
            padding: '20px', 
            margin: '20px 0' 
          }}>
            <Heading as="h3" style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 12px' }}>
              Prospect Details
            </Heading>
            
            <Text style={{ margin: '8px 0', fontSize: '14px' }}>
              <strong>Name:</strong> {prospectName}
            </Text>
            <Text style={{ margin: '8px 0', fontSize: '14px' }}>
              <strong>Email:</strong> {prospectEmail}
            </Text>
            {prospectPhone && (
              <Text style={{ margin: '8px 0', fontSize: '14px' }}>
                <strong>Phone:</strong> {prospectPhone}
              </Text>
            )}
            <Text style={{ margin: '8px 0', fontSize: '14px' }}>
              <strong>Budget:</strong> {budget}
            </Text>
            <Text style={{ margin: '8px 0', fontSize: '14px' }}>
              <strong>Location:</strong> {location}
            </Text>
            
            {message && (
              <>
                <Text style={{ margin: '16px 0 8px', fontSize: '14px', fontWeight: '600' }}>
                  Message:
                </Text>
                <Text style={{ 
                  margin: '0', 
                  fontSize: '14px', 
                  fontStyle: 'italic',
                  backgroundColor: '#ffffff',
                  padding: '12px',
                  borderRadius: '4px',
                  borderLeft: '3px solid #5a76a9'
                }}>
                  {message}
                </Text>
              </>
            )}
          </Section>

          <Button href={leadUrl} style={button}>
            View Lead Details
          </Button>

          <Text style={{ ...paragraph, fontSize: '14px', color: '#6b7280' }}>
            💡 <strong>Pro Tip:</strong> Respond within 24 hours to increase your conversion rate by 60%!
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            ikama - Franchise Hub | Your Franchise Growth Partner
            <br />
            <Link href="https://franchise-portal.com/unsubscribe" style={{ color: '#5a76a9' }}>
              Unsubscribe from lead notifications
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

/**
 * Brand Approval Email
 */
export const BrandApprovalEmail = ({ 
  ownerName, 
  brandName, 
  brandUrl,
  approved = true,
  rejectionReason 
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src="https://franchise-portal.com/logo.png"
            width="150"
            height="50"
            alt="ikama - Franchise Hub"
            style={{ margin: '0 auto 24px', display: 'block' }}
          />
          
          <Heading style={heading}>
            {approved ? '✅ Your Franchise is Live!' : '⚠️ Action Required'}
          </Heading>
          
          <Text style={paragraph}>
            Hi {ownerName},
          </Text>
          
          {approved ? (
            <>
              <Text style={paragraph}>
                Congratulations! Your <strong>{brandName}</strong> franchise has been approved and is now live on ikama - Franchise Hub.
              </Text>
              
              <Text style={paragraph}>
                Your franchise is now visible to thousands of potential franchisees actively searching for opportunities like yours.
              </Text>

              <Button href={brandUrl} style={button}>
                View Your Live Listing
              </Button>

              <Section style={{ 
                backgroundColor: '#f0fdf4', 
                borderRadius: '8px', 
                padding: '16px', 
                margin: '24px 0',
                borderLeft: '4px solid #10b981'
              }}>
                <Text style={{ margin: '0', fontSize: '14px', color: '#065f46' }}>
                  <strong>Next Steps:</strong>
                  <br />• Share your listing on social media
                  <br />• Set up email notifications for new leads
                  <br />• Complete your brand profile with photos and videos
                  <br />• Enable the chatbot to answer common questions
                </Text>
              </Section>
            </>
          ) : (
            <>
              <Text style={paragraph}>
                Thank you for submitting <strong>{brandName}</strong> to ikama - Franchise Hub. 
                Unfortunately, we need some additional information before we can approve your listing.
              </Text>
              
              {rejectionReason && (
                <Section style={{ 
                  backgroundColor: '#fef2f2', 
                  borderRadius: '8px', 
                  padding: '16px', 
                  margin: '24px 0',
                  borderLeft: '4px solid #ef4444'
                }}>
                  <Text style={{ margin: '0', fontSize: '14px', color: '#991b1b' }}>
                    <strong>Required Action:</strong>
                    <br />{rejectionReason}
                  </Text>
                </Section>
              )}

              <Button href={brandUrl} style={button}>
                Update Your Listing
              </Button>

              <Text style={{ ...paragraph, fontSize: '14px' }}>
                If you have any questions, please contact our support team at support@ikama.in
              </Text>
            </>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            ikama - Franchise Hub | Your Franchise Growth Partner
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

/**
 * Welcome Email for New Users
 */
export const WelcomeEmail = ({ userName, userType = 'prospect' }) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src="https://franchise-portal.com/logo.png"
            width="150"
            height="50"
            alt="ikama - Franchise Hub"
            style={{ margin: '0 auto 24px', display: 'block' }}
          />
          
          <Heading style={heading}>Welcome to ikama - Franchise Hub! 🎉</Heading>
          
          <Text style={paragraph}>
            Hi {userName},
          </Text>
          
          <Text style={paragraph}>
            Thank you for joining ikama - Franchise Hub, your gateway to discovering the perfect franchise opportunity!
          </Text>

          {userType === 'prospect' ? (
            <>
              <Section style={{ margin: '24px 0' }}>
                <Heading as="h3" style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 12px' }}>
                  Get Started:
                </Heading>
                
                <Text style={{ margin: '8px 0', fontSize: '14px' }}>
                  ✅ Browse thousands of franchise opportunities
                  <br />✅ Save your favorite brands
                  <br />✅ Compare different franchises side-by-side
                  <br />✅ Use our ROI calculator to plan your investment
                  <br />✅ Connect directly with franchise owners
                </Text>
              </Section>

              <Button href="https://franchise-portal.com/brands" style={button}>
                Start Exploring Franchises
              </Button>
            </>
          ) : (
            <>
              <Section style={{ margin: '24px 0' }}>
                <Heading as="h3" style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 12px' }}>
                  Grow Your Franchise:
                </Heading>
                
                <Text style={{ margin: '8px 0', fontSize: '14px' }}>
                  ✅ Create your franchise listing
                  <br />✅ Receive qualified leads instantly
                  <br />✅ Track inquiries and analytics
                  <br />✅ Engage prospects with our chatbot
                  <br />✅ Showcase your success stories
                </Text>
              </Section>

              <Button href="https://franchise-portal.com/register-brand" style={button}>
                List Your Franchise
              </Button>
            </>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            Need help? Contact us at support@ikama.in
            <br />
            ikama - Franchise Hub | Your Franchise Growth Partner
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

/**
 * Saved Search Alert Email
 */
export const SavedSearchAlertEmail = ({ 
  userName, 
  searchCriteria,
  matchingBrands = [],
  searchUrl 
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src="https://franchise-portal.com/logo.png"
            width="150"
            height="50"
            alt="ikama - Franchise Hub"
            style={{ margin: '0 auto 24px', display: 'block' }}
          />
          
          <Heading style={heading}>New Franchise Matches! 🎯</Heading>
          
          <Text style={paragraph}>
            Hi {userName},
          </Text>
          
          <Text style={paragraph}>
            We found <strong>{matchingBrands.length} new franchise{matchingBrands.length !== 1 ? 's' : ''}</strong> that match your saved search criteria:
          </Text>

          <Section style={{ 
            backgroundColor: '#f8fafc', 
            borderRadius: '8px', 
            padding: '16px', 
            margin: '20px 0' 
          }}>
            <Text style={{ fontSize: '14px', color: '#64748b', margin: '0' }}>
              {searchCriteria}
            </Text>
          </Section>

          {matchingBrands.slice(0, 3).map((brand, index) => (
            <Section key={index} style={{ 
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px', 
              padding: '16px', 
              margin: '16px 0' 
            }}>
              <Row>
                <Column style={{ width: '80px' }}>
                  <Img 
                    src={brand.logo} 
                    width="64" 
                    height="64" 
                    alt={brand.name}
                    style={{ borderRadius: '8px' }}
                  />
                </Column>
                <Column>
                  <Heading as="h4" style={{ fontSize: '16px', margin: '0 0 8px', fontWeight: '600' }}>
                    {brand.name}
                  </Heading>
                  <Text style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px' }}>
                    {brand.category} • Investment: {brand.investment}
                  </Text>
                  <Link href={brand.url} style={{ fontSize: '14px', color: '#5a76a9', fontWeight: '500' }}>
                    View Details →
                  </Link>
                </Column>
              </Row>
            </Section>
          ))}

          {matchingBrands.length > 3 && (
            <Text style={{ ...paragraph, fontSize: '14px', textAlign: 'center' }}>
              + {matchingBrands.length - 3} more matches
            </Text>
          )}

          <Button href={searchUrl} style={button}>
            View All Matches
          </Button>

          <Hr style={hr} />

          <Text style={footer}>
            <Link href="https://franchise-portal.com/saved-searches" style={{ color: '#5a76a9' }}>
              Manage your saved searches
            </Link>
            <br />
            ikama - Franchise Hub | Your Franchise Growth Partner
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

/**
 * Inquiry Response Email
 */
export const InquiryResponseEmail = ({ 
  prospectName, 
  brandName,
  brandOwnerName,
  responseMessage,
  contactInfo
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src="https://franchise-portal.com/logo.png"
            width="150"
            height="50"
            alt="ikama - Franchise Hub"
            style={{ margin: '0 auto 24px', display: 'block' }}
          />
          
          <Heading style={heading}>Response to Your Inquiry</Heading>
          
          <Text style={paragraph}>
            Hi {prospectName},
          </Text>
          
          <Text style={paragraph}>
            {brandOwnerName} has responded to your inquiry about <strong>{brandName}</strong>!
          </Text>

          <Section style={{ 
            backgroundColor: '#f8fafc', 
            borderRadius: '8px', 
            padding: '20px', 
            margin: '20px 0',
            borderLeft: '4px solid #5a76a9'
          }}>
            <Text style={{ fontSize: '14px', margin: '0', whiteSpace: 'pre-wrap' }}>
              {responseMessage}
            </Text>
          </Section>

          {contactInfo && (
            <Section style={{ margin: '20px 0' }}>
              <Heading as="h3" style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px' }}>
                Contact Information:
              </Heading>
              <Text style={{ fontSize: '14px', margin: '4px 0' }}>
                📧 {contactInfo.email}
              </Text>
              {contactInfo.phone && (
                <Text style={{ fontSize: '14px', margin: '4px 0' }}>
                  📞 {contactInfo.phone}
                </Text>
              )}
            </Section>
          )}

          <Button href={`https://franchise-portal.com/brands/${brandName}`} style={button}>
            View Franchise Details
          </Button>

          <Hr style={hr} />

          <Text style={footer}>
            ikama - Franchise Hub | Your Franchise Growth Partner
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default {
  NewLeadEmail,
  BrandApprovalEmail,
  WelcomeEmail,
  SavedSearchAlertEmail,
  InquiryResponseEmail,
};
