$ErrorActionPreference = "Stop"

Write-Host "Stopping any lingering jobs if necessary..."
aws amplify stop-job --app-id dnhik5dayaggh --branch-name main --job-id 25 --region ap-southeast-2 --profile shree-keshar-fabrication 2>$null

Write-Host "Creating Amplify deployment..."
$rawJson = aws amplify create-deployment --app-id dnhik5dayaggh --branch-name main --region ap-southeast-2 --profile shree-keshar-fabrication --output json
$deployment = $rawJson | ConvertFrom-Json
$jobId = $deployment.jobId
$zipUploadUrl = $deployment.zipUploadUrl

Write-Host "Deployment created with JobId: $jobId"
Write-Host "Uploading dist.zip to Amplify S3..."

Invoke-RestMethod -Uri $zipUploadUrl -Method Put -InFile "dist.zip" -ContentType "application/zip"

Write-Host "Starting deployment for JobId $jobId..."
$start = aws amplify start-deployment --app-id dnhik5dayaggh --branch-name main --job-id $jobId --region ap-southeast-2 --profile shree-keshar-fabrication --output json | ConvertFrom-Json

Write-Host "Deployment started! Initial status: $($start.jobSummary.status)"

# Wait for completion
Write-Host "Waiting for deployment to complete..."
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 3
    $job = aws amplify get-job --app-id dnhik5dayaggh --branch-name main --job-id $jobId --region ap-southeast-2 --profile shree-keshar-fabrication --output json | ConvertFrom-Json
    $status = $job.job.summary.status
    Write-Host "Job status: $status ($(($i + 1) * 3)s)"
    if ($status -eq "SUCCEED") {
        Write-Host "SUCCESS: Deployment $jobId completed successfully!"
        break
    } elseif ($status -eq "FAILED" -or $status -eq "CANCELLED") {
        Write-Error "Deployment failed with status $status"
        exit 1
    }
}
