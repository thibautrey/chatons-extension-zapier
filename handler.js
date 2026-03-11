// Zapier extension handler
// Exports a function(apiName, payload, ctx) that handles all Zapier API calls.

var EXTENSION_ID = '@thibautrey/chatons-extension-zapier';
var API_KEY_STORAGE_KEY = 'zapier_api_key';

async function getConfig(ctx) {
  var keyResult = await ctx.storageKvGet(EXTENSION_ID, API_KEY_STORAGE_KEY);
  var apiKey = (keyResult && keyResult.ok && typeof keyResult.data === 'string' && keyResult.data.trim())
    ? keyResult.data.trim() : null;
  if (!apiKey) {
    console.warn('[Zapier Extension] Missing API key.');
  }
  return { apiKey: apiKey };
}

function buildRequirementSheetHtml() {
  return '<!DOCTYPE html>\n' +
    '<html>\n<head>\n<meta charset="utf-8">\n' +
    '<style>\n' +
    '  * { box-sizing: border-box; margin: 0; padding: 0; }\n' +
    '  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #1a1a2e; background: transparent; }\n' +
    '  .dark body { color: #e0e0e6; }\n' +
    '  h2 { font-size: 16px; margin-bottom: 8px; }\n' +
    '  p { font-size: 13px; color: #666; margin-bottom: 16px; }\n' +
    '  .dark p { color: #999; }\n' +
    '  label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; margin-top: 12px; }\n' +
    '  input[type="text"] { width: 100%; padding: 8px 12px; border: 1px solid #d0d0d8; border-radius: 6px; font-size: 14px; background: #fff; color: #1a1a2e; outline: none; }\n' +
    '  .dark input[type="text"] { background: #2a2a3e; border-color: #444; color: #e0e0e6; }\n' +
    '  input[type="text"]:focus { border-color: #ff4a00; }\n' +
    '  .actions { display: flex; gap: 8px; margin-top: 16px; }\n' +
    '  button { padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; border: 1px solid transparent; }\n' +
    '  .btn-primary { background: #ff4a00; color: #fff; }\n' +
    '  .btn-primary:hover { background: #e04300; }\n' +
    '  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }\n' +
    '  .btn-secondary { background: transparent; color: #666; border-color: #d0d0d8; }\n' +
    '  .dark .btn-secondary { color: #999; border-color: #444; }\n' +
    '  .btn-secondary:hover { background: #f0f0f4; }\n' +
    '  .dark .btn-secondary:hover { background: #333; }\n' +
    '  .help { font-size: 12px; color: #888; margin-top: 8px; }\n' +
    '  .help a { color: #ff4a00; text-decoration: none; }\n' +
    '  .help a:hover { text-decoration: underline; }\n' +
    '  .error { color: #e5534b; font-size: 12px; margin-top: 6px; display: none; }\n' +
    '</style>\n</head>\n<body>\n' +
    '  <h2>Zapier Configuration Required</h2>\n' +
    '  <p>Enter your Zapier API key to enable automation management.</p>\n' +
    '  <label for="apiKey">API Key</label>\n' +
    '  <input type="text" id="apiKey" placeholder="Enter your Zapier API key" autocomplete="off" spellcheck="false" />\n' +
    '  <div class="error" id="error">Please enter your API key.</div>\n' +
    '  <div class="help">\n' +
    '    Generate an API key in your Zapier dashboard under\n' +
    '    <a href="https://zapier.com/partner/embed/settings" target="_blank" rel="noopener">Partner Settings &rarr; API Key</a>\n' +
    '  </div>\n' +
    '  <div class="actions">\n' +
    '    <button class="btn-primary" id="saveBtn" disabled>Save &amp; Continue</button>\n' +
    '    <button class="btn-secondary" id="cancelBtn">Cancel</button>\n' +
    '  </div>\n' +
    '  <script>\n' +
    '    (function() {\n' +
    '      var keyInput = document.getElementById("apiKey");\n' +
    '      var saveBtn = document.getElementById("saveBtn");\n' +
    '      var cancelBtn = document.getElementById("cancelBtn");\n' +
    '      var errorEl = document.getElementById("error");\n' +
    '      try { if (window.parent && window.parent.document && window.parent.document.documentElement.classList.contains("dark")) { document.documentElement.classList.add("dark"); } } catch(_) {}\n' +
    '      function checkValid() { saveBtn.disabled = !keyInput.value.trim(); errorEl.style.display = "none"; }\n' +
    '      keyInput.addEventListener("input", checkValid);\n' +
    '      saveBtn.addEventListener("click", async function() {\n' +
    '        var key = keyInput.value.trim();\n' +
    '        if (!key) { errorEl.textContent = "Please enter your API key."; errorEl.style.display = "block"; return; }\n' +
    '        try {\n' +
    '          if (key.length > 1000) throw new Error("API key is too long (max 1000 characters)");\n' +
    '        } catch(e) {\n' +
    '          errorEl.textContent = e.message || "Invalid input.";\n' +
    '          errorEl.style.display = "block";\n' +
    '          return;\n' +
    '        }\n' +
    '        saveBtn.disabled = true;\n' +
    '        try {\n' +
    '          var chatonBridge = window.parent.chaton || window.chaton;\n' +
    '          if (!chatonBridge) throw new Error("Chatons bridge not found.");\n' +
    '          if (typeof chatonBridge.extensionStorageKvSet !== "function") throw new Error("Storage API not available.");\n' +
    '          var keyResult = await chatonBridge.extensionStorageKvSet("' + EXTENSION_ID + '", "' + API_KEY_STORAGE_KEY + '", key);\n' +
    '          if (!keyResult || keyResult.error) throw new Error("Failed to save API key: " + (keyResult && keyResult.error || "Unknown error"));\n' +
    '          window.parent.postMessage({ type: "chaton:requirement-sheet:confirm" }, "*");\n' +
    '        } catch(e) {\n' +
    '          saveBtn.disabled = false;\n' +
    '          console.error("[Zapier Extension] Credential save error:", e);\n' +
    '          errorEl.textContent = e.message || "Failed to save credentials.";\n' +
    '          errorEl.style.display = "block";\n' +
    '        }\n' +
    '      });\n' +
    '      cancelBtn.addEventListener("click", function() {\n' +
    '        window.parent.postMessage({ type: "chaton:requirement-sheet:dismiss" }, "*");\n' +
    '      });\n' +
    '      keyInput.focus();\n' +
    '    })();\n' +
    '  </script>\n' +
    '</body>\n</html>';
}

function missingConfigError() {
  return {
    ok: false,
    error: {
      code: 'missing_config',
      message: 'Zapier is not configured. Please provide your API key.',
      requirementSheet: {
        html: buildRequirementSheetHtml(),
        title: 'Zapier Configuration',
      },
      pending: true,
    },
  };
}

// Generic REST call to Zapier API
var BASE_URL = 'https://api.zapier.com';

async function zapierApi(config, method, path, body) {
  if (!config.apiKey) {
    throw new Error('Zapier API key not configured.');
  }

  var url = BASE_URL + path;
  var opts = {
    method: method,
    headers: {
      'Authorization': 'Bearer ' + config.apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };
  if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT' || method === 'DELETE')) {
    opts.body = JSON.stringify(body);
  }

  var res;
  try {
    res = await fetch(url, opts);
  } catch (e) {
    throw new Error('Failed to connect to Zapier API: ' + (e.message || String(e)));
  }

  var text = await res.text();
  if (!res.ok) {
    var errorDetail = text;
    try {
      var parsed = JSON.parse(text);
      errorDetail = parsed.message || parsed.error || parsed.detail || text;
    } catch (_) {}
    throw new Error('Zapier API error (' + res.status + '): ' + (errorDetail || 'Unknown error'));
  }
  if (!text || text.trim() === '') return {};
  try { return JSON.parse(text); } catch (_) { return { raw: text }; }
}

// Build query string from params object, skipping undefined/null values
function buildQs(params) {
  var parts = [];
  for (var key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
    }
  }
  return parts.length > 0 ? '?' + parts.join('&') : '';
}

// ---- Handlers ----

async function listZaps(payload, config) {
  var qs = buildQs({ app: payload.app, offset: payload.offset, limit: payload.limit });
  return await zapierApi(config, 'GET', '/v2/zaps' + qs);
}

async function getZap(payload, config) {
  return await zapierApi(config, 'GET', '/v2/zaps/' + encodeURIComponent(payload.id));
}

async function createZap(payload, config) {
  var body = {
    data: {
      title: payload.title,
      steps: payload.steps.map(function (s) {
        return {
          action: s.action,
          inputs: s.inputs || {},
          authentication: s.authentication || null,
          alias: s.alias || null,
        };
      }),
    },
  };
  return await zapierApi(config, 'POST', '/v2/zaps', body);
}

async function enableZap(payload, config) {
  return await zapierApi(config, 'PATCH', '/v2/zaps/' + encodeURIComponent(payload.id), {
    data: { is_enabled: true },
  });
}

async function disableZap(payload, config) {
  return await zapierApi(config, 'PATCH', '/v2/zaps/' + encodeURIComponent(payload.id), {
    data: { is_enabled: false },
  });
}

async function listApps(payload, config) {
  var qs = buildQs({ query: payload.query, offset: payload.offset, limit: payload.limit });
  return await zapierApi(config, 'GET', '/v2/apps' + qs);
}

async function getActions(payload, config) {
  var qs = buildQs({ app: payload.app, action_type: payload.action_type });
  return await zapierApi(config, 'GET', '/v2/actions' + qs);
}

async function getInputFields(payload, config) {
  var body = {
    action: payload.action,
    authentication: payload.authentication || null,
    inputs: payload.inputs || {},
  };
  return await zapierApi(config, 'POST', '/v2/inputs', body);
}

async function getOutputFields(payload, config) {
  var body = {
    action: payload.action,
    authentication: payload.authentication || null,
    inputs: payload.inputs || {},
  };
  return await zapierApi(config, 'POST', '/v2/outputs', body);
}

async function getChoices(payload, config) {
  var body = {
    action: payload.action,
    field: payload.field,
    authentication: payload.authentication || null,
    inputs: payload.inputs || {},
  };
  return await zapierApi(config, 'POST', '/v2/choices', body);
}

async function listAuthentications(payload, config) {
  var qs = buildQs({ app: payload.app, offset: payload.offset, limit: payload.limit });
  return await zapierApi(config, 'GET', '/v2/authentications' + qs);
}

async function listZapTemplates(payload, config) {
  var qs = buildQs({ apps: payload.apps, offset: payload.offset, limit: payload.limit });
  return await zapierApi(config, 'GET', '/v2/zap-templates' + qs);
}

async function guessZap(payload, config) {
  return await zapierApi(config, 'POST', '/v2/zaps/guess', {
    data: { description: payload.description },
  });
}

async function stepTest(payload, config) {
  var body = {
    action: payload.action,
    authentication: payload.authentication || null,
    inputs: payload.inputs || {},
  };
  return await zapierApi(config, 'POST', '/v2/step-test', body);
}

// Routing table
var ROUTES = {
  zapier_list_zaps: listZaps,
  zapier_get_zap: getZap,
  zapier_create_zap: createZap,
  zapier_enable_zap: enableZap,
  zapier_disable_zap: disableZap,
  zapier_list_apps: listApps,
  zapier_get_actions: getActions,
  zapier_get_input_fields: getInputFields,
  zapier_get_output_fields: getOutputFields,
  zapier_get_choices: getChoices,
  zapier_list_authentications: listAuthentications,
  zapier_list_zap_templates: listZapTemplates,
  zapier_guess_zap: guessZap,
  zapier_step_test: stepTest,
};

function normalizeApiName(apiName) {
  var raw = typeof apiName === 'string' ? apiName.trim() : '';
  if (!raw) return '';
  // Accept dotted names (zapier.list_zaps) or underscored
  if (raw.indexOf('zapier.') === 0) {
    return 'zapier_' + raw.slice('zapier.'.length);
  }
  return raw;
}

export default async function handler(apiName, payload, ctx) {
  var p = (payload && typeof payload === 'object' && !Array.isArray(payload)) ? payload : {};
  var normalizedApiName = normalizeApiName(apiName);

  var fn = ROUTES[normalizedApiName];
  if (!fn) {
    var err = { code: 'not_found', message: 'API ' + apiName + ' not found on ' + EXTENSION_ID };
    console.error('[Zapier Extension] ' + err.message);
    return { ok: false, error: err };
  }

  var config = await getConfig(ctx);
  if (!config.apiKey) {
    console.warn('[Zapier Extension] Missing API key. Showing requirement sheet.');
    return missingConfigError();
  }

  try {
    console.log('[Zapier Extension] Calling API:', normalizedApiName);
    var data = await fn(p, config);
    console.log('[Zapier Extension] API success:', normalizedApiName);
    return { ok: true, data: data };
  } catch (e) {
    var errorMessage = e.message || String(e) || 'Unknown error';
    console.error('[Zapier Extension] API error:', normalizedApiName, errorMessage, e);
    return { ok: false, error: { code: 'api_error', message: errorMessage } };
  }
}
