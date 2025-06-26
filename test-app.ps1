# TODO Application Testing Script
# This script tests the basic functionality of the TODO application

Write-Host "🧪 TODO Application Testing Suite" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Function to test HTTP endpoint
function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Description,
        [string]$Method = "GET",
        [hashtable]$Body = $null
    )
    
    try {
        Write-Host "Testing: $Description" -ForegroundColor Cyan
        
        $params = @{
            Uri = $Url
            Method = $Method
            ContentType = "application/json"
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "✅ SUCCESS: $Description" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ FAILED: $Description" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to check if port is listening
function Test-Port {
    param(
        [int]$Port,
        [string]$Service
    )
    
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $Port -WarningAction SilentlyContinue
        if ($connection.TcpTestSucceeded) {
            Write-Host "✅ $Service is running on port $Port" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $Service is NOT running on port $Port" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Cannot test port $Port for $Service" -ForegroundColor Red
        return $false
    }
}

Write-Host ""
Write-Host "🔍 Step 1: Checking if servers are running..." -ForegroundColor Yellow

$backendRunning = Test-Port -Port 5000 -Service "Backend Server"
$frontendRunning = Test-Port -Port 3000 -Service "Frontend Server"

if (-not $backendRunning) {
    Write-Host ""
    Write-Host "⚠️  Backend server is not running!" -ForegroundColor Yellow
    Write-Host "   Please start the backend server first:" -ForegroundColor Yellow
    Write-Host "   cd backend && npm run dev" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Or run the startup script: .\start-app.ps1" -ForegroundColor Cyan
    exit 1
}

if (-not $frontendRunning) {
    Write-Host ""
    Write-Host "⚠️  Frontend server is not running!" -ForegroundColor Yellow
    Write-Host "   Please start the frontend server first:" -ForegroundColor Yellow
    Write-Host "   cd frontend && npm run dev" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Or run the startup script: .\start-app.ps1" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🧪 Step 2: Testing Backend API Endpoints..." -ForegroundColor Yellow

$baseUrl = "http://localhost:5000"
$testResults = @()

# Test root endpoint
$testResults += Test-Endpoint -Url "$baseUrl/" -Description "Root endpoint"

# Test get all tasks
$testResults += Test-Endpoint -Url "$baseUrl/tasks" -Description "Get all tasks"

# Test create task
$newTask = @{ item = "Test task from testing script - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" }
$createResult = Test-Endpoint -Url "$baseUrl/tasks" -Description "Create new task" -Method "POST" -Body $newTask
$testResults += $createResult

# Get tasks again to find our test task
if ($createResult) {
    try {
        Start-Sleep -Seconds 1
        $tasks = Invoke-RestMethod -Uri "$baseUrl/tasks" -Method "GET"
        $testTask = $tasks | Where-Object { $_.item -like "*Test task from testing script*" } | Select-Object -First 1
        
        if ($testTask) {
            $taskId = $testTask._id
            Write-Host "📝 Created test task with ID: $taskId" -ForegroundColor Gray
            
            # Test update task
            $updateData = @{ 
                item = $testTask.item
                done = $true 
            }
            $testResults += Test-Endpoint -Url "$baseUrl/tasks/$taskId" -Description "Update task (mark as done)" -Method "PUT" -Body $updateData
            
            # Test delete task
            $testResults += Test-Endpoint -Url "$baseUrl/tasks/$taskId" -Description "Delete test task" -Method "DELETE"
        }
    }
    catch {
        Write-Host "⚠️  Could not perform update/delete tests" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🌐 Step 3: Testing Frontend Accessibility..." -ForegroundColor Yellow

if ($frontendRunning) {
    try {
        $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
        if ($frontendResponse.StatusCode -eq 200) {
            Write-Host "✅ Frontend is accessible" -ForegroundColor Green
        } else {
            Write-Host "❌ Frontend returned status code: $($frontendResponse.StatusCode)" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ Frontend is not accessible" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Frontend server is not running - skipping frontend tests" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 Test Results Summary" -ForegroundColor Yellow
Write-Host "======================" -ForegroundColor Yellow

$passedTests = ($testResults | Where-Object { $_ -eq $true }).Count
$totalTests = $testResults.Count

Write-Host "Passed: $passedTests / $totalTests tests" -ForegroundColor Cyan

if ($passedTests -eq $totalTests -and $totalTests -gt 0) {
    Write-Host ""
    Write-Host "🎉 All tests passed! Your TODO application is working correctly!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 You can now:" -ForegroundColor Cyan
    Write-Host "   • Open http://localhost:3000 to use the application" -ForegroundColor White
    Write-Host "   • Add, edit, complete, and delete tasks" -ForegroundColor White
    Write-Host "   • Access the API directly at http://localhost:5000/tasks" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "⚠️  Some tests failed. Please check the errors above." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 Troubleshooting tips:" -ForegroundColor Cyan
    Write-Host "   • Make sure both servers are running" -ForegroundColor White
    Write-Host "   • Check for error messages in the server console windows" -ForegroundColor White
    Write-Host "   • Verify MongoDB connection is working" -ForegroundColor White
    Write-Host "   • Try restarting the servers" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
