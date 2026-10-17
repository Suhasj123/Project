param (
    [int]$MaxIterations = 10,
    [switch]$VerifyOnly,
    [string]$AgentCommand = ""
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " [RALPH LOOP] Autonomous AI Coding Iteration Engine" -ForegroundColor Yellow
Write-Host " Fresh Context Iterations - External File Memory - Git Ops" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

$prdPath = Join-Path $PSScriptRoot "prd.json"
$progressPath = Join-Path $PSScriptRoot "progress.txt"

if (-not (Test-Path $prdPath)) {
    Write-Host "[ERROR] prd.json not found in $PSScriptRoot" -ForegroundColor Red
    exit 1
}

$iteration = 1

while ($iteration -le $MaxIterations) {
    Write-Host ""
    Write-Host "[Ralph Loop] Iteration $iteration of $MaxIterations..." -ForegroundColor Blue

    # Read latest PRD state fresh from disk
    $prdRaw = Get-Content $prdPath -Raw
    $prd = $prdRaw | ConvertFrom-Json

    $pendingTasks = @($prd.tasks | Where-Object { $_.status -ne "completed" })

    if ($pendingTasks.Count -eq 0) {
        Write-Host ""
        Write-Host "[Ralph Loop] SUCCESS: All tasks in prd.json are complete!" -ForegroundColor Green
        Write-Host "Running final system validation..." -ForegroundColor Yellow
        & node backend/test_runner.js
        exit 0
    }

    $currentTask = $pendingTasks[0]
    Write-Host ">> Active Task [$($currentTask.id)]: $($currentTask.title)" -ForegroundColor Yellow
    Write-Host "   Description: $($currentTask.description)" -ForegroundColor Gray

    if ($AgentCommand) {
        Write-Host "   Executing Agent Task Command..." -ForegroundColor Cyan
        Invoke-Expression $AgentCommand
    }

    if ($currentTask.testCommand) {
        Write-Host "   Running Verification: $($currentTask.testCommand)" -ForegroundColor Cyan
        Invoke-Expression $currentTask.testCommand
        $testExitCode = $LASTEXITCODE

        if ($testExitCode -ne 0) {
            Write-Host "[FAIL] Task $($currentTask.id) verification failed (Exit code: $testExitCode)." -ForegroundColor Red
            Add-Content -Path $progressPath -Value "[Iteration $iteration] Task $($currentTask.id) verification FAILED at $(Get-Date)"
            exit 1
        } else {
            Write-Host "[PASS] Task $($currentTask.id) verified successfully!" -ForegroundColor Green
        }
    }

    # Mark completed in PRD
    $currentTask.status = "completed"
    $updatedJson = $prd | ConvertTo-Json -Depth 10
    Set-Content -Path $prdPath -Value $updatedJson

    # Append to progress log
    $logEntry = "`n[Iteration $iteration - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')]`n- Completed: $($currentTask.id) - $($currentTask.title)`n- Status: PASSED"
    Add-Content -Path $progressPath -Value $logEntry

    # Auto-commit to Git if enabled
    if ($prd.autonomousSettings.autoGitCommit) {
        git add prd.json progress.txt
        $diff = git status --porcelain
        if ($diff) {
            git commit -m "$($prd.autonomousSettings.commitPrefix)$($currentTask.id) - $($currentTask.title)"
            Write-Host "[GIT] Committed progress to Git." -ForegroundColor DarkGreen
        }
    }

    if ($VerifyOnly) {
        break
    }

    $iteration++
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "[Ralph Loop] Completed iteration cycle." -ForegroundColor Cyan
