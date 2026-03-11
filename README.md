# Zapier Extension for Chatons

Manage your Zapier automations directly from Chatons conversations.

## Features

- ⚙️ **Zap Management** - List, create, enable, and disable Zaps
- 🔌 **App Integration** - Browse available apps and actions
- 🔧 **Configuration** - Build Zaps by specifying triggers and actions
- 🧪 **Testing** - Test Zap steps before deployment
- 📝 **Templates** - Use Zapier's pre-built templates
- 🤖 **AI-Powered** - Use natural language to create Zaps

## Installation

1. Open Chatons settings
2. Go to Extensions → Add Extension
3. Search for or paste: `@thibautrey/chatons-extension-zapier`
4. Click Install

## Configuration

### Initial Setup

1. Navigate to the extension settings
2. Click "Connect Zapier Account"
3. Authorize Chatons to access your Zapier account
4. Configuration is automatic after authorization

### Required Permissions

- Zap management (list, create, edit)
- App integration access
- Action execution permissions

## Usage

### List and Manage Zaps

```
"List all my Zaps"
"Get details of Zap: Send Slack messages"
"Enable Zap: Daily digest"
"Disable Zap: Old automation"
```

### Create Zaps

```
"Create a Zap that sends Slack notifications when Gmail receives email"
"Set up automation to add GitHub issues to Linear"
"Build Zap: Create Notion page from Google Form submission"
```

### Browse Apps and Actions

```
"List available Zapier apps"
"Search for apps related to email"
"Get actions for Slack app"
"List input fields for creating a GitHub issue"
```

### Test and Use Templates

```
"List Zapier templates"
"Test a step to verify configuration"
"Show templates for email and spreadsheet"
```

## Available Tools

**Zaps**
- `zapier_list_zaps` - List all Zaps
- `zapier_get_zap` - Get Zap details
- `zapier_create_zap` - Create new Zap
- `zapier_enable_zap` - Enable a Zap
- `zapier_disable_zap` - Disable a Zap

**Apps & Actions**
- `zapier_list_apps` - List available apps
- `zapier_get_actions` - Get actions for an app
- `zapier_list_authentications` - List connected accounts

**Configuration**
- `zapier_get_input_fields` - Get input fields for an action
- `zapier_get_output_fields` - Get output fields from an action
- `zapier_get_choices` - Get dropdown choices for a field

**Templates & Testing**
- `zapier_list_zap_templates` - List available templates
- `zapier_guess_zap` - AI-suggest Zap from description
- `zapier_step_test` - Test a Zap step

## Examples

### Create Email to Slack Zap

```
"Create Zap: When new Gmail email arrives, send Slack message"
```

### Set Up Notification Chain

```
"Create Zap that sends email when Slack gets mentioned"
"Test the action"
"Enable the Zap"
```

### Multi-Service Integration

```
"Create Zap linking GitHub to Linear to Slack"
"When issue created in GitHub, create in Linear and notify Slack"
```

## Zap Structure

A Zap consists of:
- **Trigger** - What initiates the automation (read action)
- **Action** - What happens as a result (write action)
- **Filters** (optional) - Conditional logic
- **Multiple steps** - Chain multiple actions

## Popular Integrations

Common Zap combinations:
- **Email → Spreadsheet** - Auto-add to Google Sheets
- **Form → Database** - Capture form responses
- **GitHub → Slack** - Notify on code changes
- **Calendar → Email** - Send reminders
- **CRM → Email** - Trigger campaigns

## Authentication

Zapier uses OAuth for secure authentication with connected services. Each step may require its own authentication if connecting to a new service.

## Security

- OAuth authentication with all services
- Credentials stored securely by Zapier
- No API keys exposed in Chatons
- Data encrypted in transit
- Zapier's security standards apply

## Requirements

- Zapier account (free or paid)
- Authorization via OAuth
- Network access to Zapier API

## Support

For issues or feature requests, please open an issue on [GitHub](https://github.com/thibautrey/chatons-extension-zapier).

## License

MIT

---

**Version**: 1.0.1  
**Author**: @thibautrey  
**Repository**: https://github.com/thibautrey/chatons-extension-zapier
