# Integration Verification Script for Task 15
# This script performs automated checks on the integration points

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Integration Verification for Task 15" -ForegroundColor Cyan
Write-Host "Story Customization Enhancements" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$passed = 0
$failed = 0
$warnings = 0

# Configuration
$backendUrl = "http://localhost:8083"
$frontendUrl = "http://localhost:3000"
$configFile = "storage/api-config.json"

# Helper function to test endpoint
function Test-Endpoint {
    param($url, $description)
    try {
        $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ PASS: $description" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ FAIL: $description" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
        return $false
    }
}

# Helper function to check file content
function Test-FileContent {
    param($file, $pattern, $description)
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match $pattern) {
            Write-Host "✅ PASS: $description" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ FAIL: $description" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "⚠️  WARN: $description - File not found: $file" -ForegroundColor Yellow
        return $null
    }
}

Write-Host "1. Backend Service Checks" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

# Check backend health
if (Test-Endpoint "$backendUrl/actuator/health" "Backend health endpoint") {
    $passed++
} else {
    $failed++
    Write-Host "   ⚠️  Backend may not be running. Start with: cd backend && mvn spring-boot:run" -ForegroundColor Yellow
}

# Check admin configuration endpoint
if (Test-Endpoint "$backendUrl/api/admin/configuration" "Admin configuration endpoint") {
    $passed++
    
    # Verify voice fields in configuration
    try {
        $config = Invoke-RestMethod -Uri "$backendUrl/api/admin/configuration" -Method Get
        if ($config.maleVoiceId -and $config.femaleVoiceId) {
            Write-Host "✅ PASS: Voice configuration fields present" -ForegroundColor Green
            Write-Host "   Male Voice ID: $($config.maleVoiceId)" -ForegroundColor Gray
            Write-Host "   Female Voice ID: $($config.femaleVoiceId)" -ForegroundColor Gray
            $passed++
        } else {
            Write-Host "❌ FAIL: Voice configuration fields missing" -ForegroundColor Red
            $failed++
        }
    } catch {
        Write-Host "⚠️  WARN: Could not verify voice configuration" -ForegroundColor Yellow
        $warnings++
    }
} else {
    $failed++
}

Write-Host ""
Write-Host "2. Frontend Service Checks" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

# Check frontend accessibility
if (Test-Endpoint $frontendUrl "Frontend accessibility") {
    $passed++
} else {
    $failed++
    Write-Host "   ⚠️  Frontend may not be running. Start with: cd frontend && npm run dev" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "3. Configuration File Checks" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

# Check voice configuration in file
$result = Test-FileContent $configFile "maleVoiceId" "Male voice ID in config file"
if ($result -eq $true) { $passed++ } elseif ($result -eq $false) { $failed++ } else { $warnings++ }

$result = Test-FileContent $configFile "femaleVoiceId" "Female voice ID in config file"
if ($result -eq $true) { $passed++ } elseif ($result -eq $false) { $failed++ } else { $warnings++ }

Write-Host ""
Write-Host "4. Type Definition Checks" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

# Check frontend types
$frontendTypes = "frontend/src/types/index.ts"
$result = Test-FileContent $frontendTypes "theme.*'spooky'.*'adventure'.*'fantasy'" "Theme type definition"
if ($result -eq $true) { $passed++ } elseif ($result -eq $false) { $failed++ } else { $warnings++ }

$result = Test-FileContent $frontendTypes "voiceType.*'male'.*'female'" "Voice type definition"
if ($result -eq $true) { $passed++ } elseif ($result -eq $false) { $failed++ } else { $warnings++ }

# Check backend model
$backendModel = "backend/src/main/java/com/frankenstein/story/model/StoryInput.java"
$result = Test-FileContent $backendModel "private String theme" "Backend theme field"
if ($result -eq $true) { $passed++ } elseif ($result -eq $false) { $failed++ } else { $warnings++ }

$result = Test-FileContent $backendModel "private String voiceType" "Backend voiceType field"
if ($result -eq $true) { $passed++ } elseif ($result -eq $false) { $failed++ } else { $warnings++ }

Write-Host ""
Write-Host "5. Component Checks" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

# Check ThemeSelector component
$themeSelector = "frontend/src/components/ThemeSelector.tsx"
if (Test-Path $themeSelector) {
    Write-Host "✅ PASS: ThemeSelector component exists" -ForegroundColor Green
    $passed++
} else {
    Write-Host "❌ FAIL: ThemeSelector component not found" -ForegroundColor Red
    $failed++
}

# Check VoiceSelector component
$voiceSelector = "frontend/src/components/VoiceSelector.tsx"
if (Test-Path $voiceSelector) {
    Write-Host "✅ PASS: VoiceSelector component exists" -ForegroundColor Green
    $passed++
} else {
    Write-Host "❌ FAIL: VoiceSelector component not found" -ForegroundColor Red
    $failed++
}

# Check VoiceConfiguration admin component
$voiceConfig = "frontend/src/components/admin/VoiceConfiguration.tsx"
if (Test-Path $voiceConfig) {
    Write-Host "✅ PASS: VoiceConfiguration admin component exists" -ForegroundColor Green
    $passed++
} else {
    Write-Host "❌ FAIL: VoiceConfiguration admin component not found" -ForegroundColor Red
    $failed++
}

Write-Host ""
Write-Host "6. Service Implementation Checks" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

# Check StoryGenerationService for outline methods
$storyGenService = "backend/src/main/java/com/frankenstein/story/service/StoryGenerationService.java"
$result = Test-FileContent $storyGenService "generateOutline" "Outline generation method"
if ($result -eq $true) { $passed++ } elseif ($result -eq $false) { $failed++ } else { $warnings++ }

$result = Test-FileContent $storyGenService "generateFullStory" "Full story generation method"
if ($result -eq $true) { $passed++ } elseif ($result -eq $false) { $failed++ } else { $warnings++ }

# Check AudioGenerationService for voice selection
$audioService = "backend/src/main/java/com/frankenstein/story/service/AudioGenerationService.java"
$result = Test-FileContent $audioService "getVoiceIdForType" "Voice selection method"
if ($result -eq $true) { $passed++ } elseif ($result -eq $false) { $failed++ } else { $warnings++ }

# Check ImageGenerationService for composition enhancement
$imageService = "backend/src/main/java/com/frankenstein/story/service/ImageGenerationService.java"
$result = Test-FileContent $imageService "enhancePromptWithComposition" "Image composition enhancement"
if ($result -eq $true) { $passed++ } elseif ($result -eq $false) { $failed++ } else { $warnings++ }

Write-Host ""
Write-Host "7. Progress Stage Checks" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan

# Check LoadingPage for outline stage
$loadingPage = "frontend/src/pages/LoadingPage.tsx"
$result = Test-FileContent $loadingPage "GENERATING_OUTLINE" "Outline generation stage"
if ($result -eq $true) { $passed++ } elseif ($result -eq $false) { $failed++ } else { $warnings++ }

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verification Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Passed:  $passed" -ForegroundColor Green
Write-Host "❌ Failed:  $failed" -ForegroundColor Red
Write-Host "⚠️  Warnings: $warnings" -ForegroundColor Yellow
Write-Host ""

if ($failed -eq 0) {
    Write-Host "🎉 All critical checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Run manual integration tests (see INTEGRATION_TEST_PLAN.md)" -ForegroundColor White
    Write-Host "2. Generate a test story with theme and voice selection" -ForegroundColor White
    Write-Host "3. Verify outline generation phase appears in progress" -ForegroundColor White
    Write-Host "4. Verify story has 10-15 pages" -ForegroundColor White
    Write-Host "5. Verify images have left-third composition" -ForegroundColor White
    Write-Host "6. Verify audio uses selected voice" -ForegroundColor White
    Write-Host "7. Test admin voice configuration updates" -ForegroundColor White
    Write-Host ""
    exit 0
} else {
    Write-Host "⚠️  Some checks failed. Please review the errors above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common Issues:" -ForegroundColor Cyan
    Write-Host "- Backend not running: cd backend && mvn spring-boot:run" -ForegroundColor White
    Write-Host "- Frontend not running: cd frontend && npm run dev" -ForegroundColor White
    Write-Host "- Missing configuration: Check storage/api-config.json" -ForegroundColor White
    Write-Host "- Missing components: Verify all tasks 1-14 are complete" -ForegroundColor White
    Write-Host ""
    exit 1
}
